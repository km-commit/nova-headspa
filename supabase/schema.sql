-- ============================================================
-- Nova Head Spa — Schéma de réservation avec vraies disponibilités
-- À exécuter dans Supabase: Dashboard > SQL Editor > New query
-- ============================================================

-- Table des rendez-vous. Les infos personnelles (nom, téléphone, courriel)
-- ne sont JAMAIS exposées publiquement — seule une fonction contrôlée
-- (get_available_slots) peut être appelée par le site, et elle ne renvoie
-- que des heures, jamais les infos des clientes.
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_date date not null,
  start_time time not null,
  duration_minutes int not null check (duration_minutes > 0),
  soin text not null check (soin in ('essentiel', 'evasion', 'royal')),
  prenom text not null,
  nom text not null,
  telephone text not null,
  email text not null,
  notes text,
  oils text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes (RLS). Par défaut, personne
-- ne peut lire ni écrire directement dans la table tant qu'on n'ajoute
-- pas de règles explicites ci-dessous.
alter table appointments enable row level security;

-- Autorise l'insertion publique (une visiteuse peut prendre rendez-vous),
-- mais AUCUNE lecture publique directe de la table (donc pas de fuite
-- des noms/téléphones/courriels des autres clientes).
create policy "Public can insert appointments"
  on appointments for insert
  to anon
  with check (true);

-- ============================================================
-- Fonction: renvoie les heures disponibles pour une date et une
-- durée de soin données, sans jamais exposer les infos personnelles.
--
-- Une zone tampon de 30 min est imposée APRÈS chaque rendez-vous
-- confirmé (nettoyage/pause entre deux clientes). La comparaison
-- est symétrique (buffer ajouté des deux côtés dans le test) pour
-- que ce tampon s'applique peu importe lequel des deux rendez-vous
-- — l'existant ou le nouveau créneau candidat — précède l'autre.
-- ============================================================
create or replace function get_available_slots(p_date date, p_duration int)
returns table(slot_time time)
language plpgsql
security definer
set search_path = public
as $$
declare
  slot time;
  slot_end time;
  opening time := '09:00';
  closing time := '17:00';
  step interval := '30 minutes';
  buffer interval := '30 minutes';
begin
  slot := opening;
  while slot < closing loop
    slot_end := slot + (p_duration || ' minutes')::interval;

    -- Le créneau ne doit pas dépasser l'heure de fermeture
    if slot_end <= closing then
      -- Le créneau est disponible s'il ne chevauche aucun rendez-vous
      -- confirmé, tampon de 30 min après chaque rendez-vous inclus
      if not exists (
        select 1 from appointments a
        where a.appointment_date = p_date
          and a.status = 'confirmed'
          and slot < (a.start_time + (a.duration_minutes || ' minutes')::interval + buffer)
          and a.start_time < (slot_end + buffer)
      ) then
        slot_time := slot;
        return next;
      end if;
    end if;

    slot := slot + step;
  end loop;
end;
$$;

-- Autorise le site (clé publique anon) à appeler cette fonction
grant execute on function get_available_slots(date, int) to anon;

-- ============================================================
-- Garde-fou côté serveur: même si le site vérifie la disponibilité
-- avant d'envoyer le formulaire, deux personnes pourraient réserver
-- le même créneau à la même seconde. Ce trigger bloque l'insertion
-- si un chevauchement existe déjà, quoi qu'il arrive.
-- ============================================================
-- security definer est essentiel ici: sans ça, ce trigger s'exécute avec les
-- droits du rôle anon, qui ne peut lire AUCUNE ligne de la table (RLS bloque
-- son SELECT) — le "exists(...)" verrait alors toujours zéro résultat et ne
-- bloquerait jamais un chevauchement. security definer fait tourner cette
-- vérification avec les droits du propriétaire de la fonction, qui voit tout.
create or replace function prevent_overlapping_appointments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  buffer interval := '30 minutes';
begin
  if exists (
    select 1 from appointments a
    where a.appointment_date = new.appointment_date
      and a.status = 'confirmed'
      and a.id is distinct from new.id
      and new.start_time < (a.start_time + (a.duration_minutes || ' minutes')::interval + buffer)
      and a.start_time < (new.start_time + (new.duration_minutes || ' minutes')::interval + buffer)
  ) then
    raise exception 'Ce créneau vient d''être réservé par quelqu''un d''autre. Merci de choisir une autre heure.';
  end if;
  return new;
end;
$$;

create trigger check_overlap_before_insert
  before insert on appointments
  for each row
  execute function prevent_overlapping_appointments();
