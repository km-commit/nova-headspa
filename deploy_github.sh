#!/bin/bash

# ============================================================
#  NOVA HEAD SPA — Script de déploiement GitHub Pages
#  Exécuter dans le terminal : bash deploy_github.sh
# ============================================================

GITHUB_USER="km-commit"
GITHUB_TOKEN="${GITHUB_TOKEN:?'⚠️  Variable GITHUB_TOKEN manquante. Exporte-la avant : export GITHUB_TOKEN=ghp_xxx'}"
REPO_NAME="nova-headspa"
BRANCH="main"

echo ""
echo "🌸 Nova Head Spa — Déploiement GitHub Pages"
echo "============================================"
echo ""

# 1. Créer le repo GitHub
echo "📦 Étape 1 : Création du repo GitHub..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Nova Head Spa — Site officiel | Napierville, QC\",\"homepage\":\"https://$GITHUB_USER.github.io/$REPO_NAME\",\"private\":false,\"auto_init\":false}")

if echo "$RESPONSE" | grep -q '"full_name"'; then
  echo "✅ Repo créé : https://github.com/$GITHUB_USER/$REPO_NAME"
elif echo "$RESPONSE" | grep -q 'already exists'; then
  echo "ℹ️  Le repo existe déjà, on continue..."
else
  echo "⚠️  Réponse GitHub :"
  echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('message','Erreur inconnue'))"
  echo ""
  echo "Si le repo existe déjà, ce n'est pas grave — le script continue."
fi

echo ""

# 2. Initialiser git localement
echo "🔧 Étape 2 : Initialisation git..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

git init -b $BRANCH 2>/dev/null || git init

# Configurer l'identité
git config user.email "6145077@gmail.com"
git config user.name "Kathalina"

# Ajouter le remote (supprimer si existant)
git remote remove origin 2>/dev/null
git remote add origin "https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

echo "✅ Git initialisé"
echo ""

# 3. Commit et push
echo "🚀 Étape 3 : Envoi des fichiers vers GitHub..."
git add index.html confidentialite.html css/ js/ assets/img/ .gitignore
git commit -m "🌸 Nova Head Spa — lancement du site web" 2>/dev/null || \
git commit --allow-empty -m "🌸 Nova Head Spa — mise à jour"

# Renommer la branche en main si nécessaire
git branch -M $BRANCH

# Push
git push -u origin $BRANCH --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Fichiers envoyés avec succès!"
else
  echo ""
  echo "❌ Erreur lors du push. Vérifie ta connexion internet."
  exit 1
fi

echo ""

# 4. Activer GitHub Pages
echo "🌐 Étape 4 : Activation de GitHub Pages..."
sleep 2

curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/pages" \
  -d "{\"source\":{\"branch\":\"$BRANCH\",\"path\":\"/\"}}" > /dev/null

echo "✅ GitHub Pages activé!"
echo ""
echo "============================================"
echo "🎉 DÉPLOIEMENT TERMINÉ!"
echo ""
echo "🔗 Lien du site (disponible dans ~2 minutes) :"
echo "   https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "📱 Partage ce lien avec ta mère! 🌸"
echo "============================================"
echo ""
