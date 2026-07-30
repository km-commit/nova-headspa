/* ============================================================
   NOVA HEAD SPA — Configuration Supabase
   La clé "anon" est publique par conception (protégée par les
   politiques RLS définies dans supabase/schema.sql) — ce n'est
   pas un secret à cacher, contrairement à un mot de passe.
   Remplace les deux valeurs ci-dessous une fois ton projet créé
   sur supabase.com (Project Settings > API).
   ============================================================ */

const SUPABASE_URL = 'https://yfwnphsxkzyqikgpnjea.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmd25waHN4a3p5cWlrZ3BuamVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MzYzOTUsImV4cCI6MjEwMTAxMjM5NX0.JcbBKtVyBN8i51k4FfnT9xhVe8oy-VfyFL-rdWThUUI';

const supabaseClient = (SUPABASE_URL.includes('TON-PROJET'))
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
