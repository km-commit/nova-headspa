# Mise en place du vrai système de réservation

## Étapes pour activer

1. Crée un compte gratuit sur [supabase.com](https://supabase.com) (idéalement avec "Continue with GitHub").
2. Crée un nouveau projet, nomme-le par exemple `nova-headspa`. Choisis une région proche (ex. `us-east-1` ou `ca-central-1` si disponible).
3. Une fois le projet créé, va dans **SQL Editor** (menu de gauche) > **New query**, colle tout le contenu de `schema.sql` (dans ce même dossier), et clique **Run**.
4. Va dans **Project Settings > API**. Tu y trouveras deux valeurs :
   - **Project URL** (ressemble à `https://xxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)
5. Ouvre `js/supabase-config.js` et remplace les deux valeurs `TON-PROJET` et `TA-CLE-ANON-PUBLIQUE` par les vraies.
6. Commit + push. Le site va maintenant vérifier les vraies disponibilités.

## Comment ça marche

- `schema.sql` crée une table `appointments`, une fonction `get_available_slots()` qui calcule les heures libres sans jamais exposer les noms/téléphones des autres clientes, et un garde-fou (`trigger`) qui empêche deux réservations sur le même créneau même si elles arrivent à la même seconde.
- `js/supabase-config.js` contient la clé publique du projet — ce n'est pas un secret (elle est protégée par les règles de sécurité RLS dans la base de données), donc pas de souci à la committer sur GitHub.
- `js/script.js` appelle `get_available_slots` quand une date est choisie, et insère le vrai rendez-vous dans la base avant d'envoyer la notification par courriel (Formspree).

## Vérifier que ça fonctionne

Après configuration, ouvre le site, choisis un soin, une date, et regarde si la liste des heures se met à jour (au lieu de toujours montrer les mêmes 16 créneaux fixes). Essaie de réserver deux fois le même créneau dans deux onglets différents pour confirmer que le deuxième est bien refusé.
