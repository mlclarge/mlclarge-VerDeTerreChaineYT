# 🌱 Ver de Terre Production - Catalogue Vidéos OPTIMISÉ

Interface de recherche moderne pour 969 vidéos agroécologiques avec **filtres intelligents**.

## ✨ NOUVEAUTÉS DE CETTE VERSION

### 🎯 Filtres optimisés
- ✅ **Catégories thématiques** : Agroforesterie, Viticulture, Élevage, Maraîchage, Grandes Cultures, Sol Vivant/ACS, Formation
- ✅ **Intervenants** : 30+ experts (François Mulet, Marcel Bouché, Konrad Schreiber, Marc-André Sélosse...)
- ✅ **Filtre par date** : Cette semaine, ce mois, 3/6 derniers mois, cette année, année dernière
- ❌ **Supprimé** : Filtre "Type de contenu" (non pertinent)

### 📊 Classification automatique
- Les 969 vidéos ont été analysées et classifiées automatiquement
- Extraction intelligente des catégories depuis les tags
- Identification des intervenants dans les titres/descriptions/tags
- Nettoyage des tags redondants

## 📁 Fichiers fournis

```
├── videos_ENRICHI.csv          # Base de données enrichie (969 vidéos)
├── index.html                  # Page principale (avec nouveaux filtres)
├── app.js                      # Logique JavaScript optimisée
├── styles.css                  # Design mis à jour
├── README.md                   # Ce fichier
└── analyse_videos.py           # Script d'analyse (pour référence)
```

## 📊 Statistiques de la base

**969 vidéos analysées**

### Catégories (9)
- Environnement : 678 vidéos (70%)
- Sol Vivant / ACS : 665 vidéos (68.6%)
- Formation : 606 vidéos (62.5%)
- Agroforesterie : 358 vidéos (36.9%)
- Maraîchage : 310 vidéos (32%)
- Élevage : 282 vidéos (29.1%)
- Grandes Cultures : 268 vidéos (27.7%)
- Viticulture : 248 vidéos (25.6%)

### Top Intervenants (30 détectés)
1. François Mulet : 241 vidéos
2. Marcel Bouché : 167 vidéos
3. Konrad Schreiber : 164 vidéos
4. Vincent Levavasseur : 69 vidéos
5. Alain Canet : 54 vidéos
6. Marc-André Sélosse : 51 vidéos
7. Sarah Singla : 22 vidéos
... et 23 autres

## 🚀 Déploiement sur GitHub Pages

### 1. Créer le repository
```bash
# Sur GitHub.com
Nom : verdeterreprod-videos-optimise
Type : Public
✓ Add README
```

### 2. Uploader les fichiers
**Fichiers OBLIGATOIRES :**
- ✅ index.html (nouveau avec filtres optimisés)
- ✅ app.js (nouvelle logique de filtrage)
- ✅ styles.css (styles mis à jour)
- ✅ videos_ENRICHI.csv (base enrichie)

**Fichiers OPTIONNELS :**
- README.md (cette documentation)

### 3. Activer GitHub Pages
```
Settings → Pages → Source : main branch → Save
```

### 4. Accéder au site
```
https://VOTRE-USERNAME.github.io/verdeterreprod-videos-optimise/
```

## 🎨 Nouvelles fonctionnalités

### Filtres intelligents
- **Par catégorie** : Filtrez par thématique agroécologique
- **Par intervenant** : Trouvez toutes les vidéos d'un expert
- **Par date** : Vidéos récentes ou archives
- **Combinaisons** : Tous les filtres sont combinables

### Tri avancé
- Plus récentes / Plus anciennes (par défaut)
- Par nombre de vues
- Par titre alphabétique
- Par durée

### Interface améliorée
- Affichage de la date de publication
- Nom de l'intervenant principal visible
- Catégories sous forme de badges
- Design responsive optimisé

## 🔧 Personnalisation

### Modifier les catégories
Éditez `analyse_videos.py` ligne 20-42, puis relancez :
```bash
python3 analyse_videos.py
```

### Ajouter des intervenants
Éditez `analyse_videos.py` ligne 48-81

### Modifier les couleurs
Éditez `styles.css` ligne 10-20 :
```css
:root {
    --primary: #2d6a4f;
    --primary-light: #40916c;
    --secondary: #52b788;
}
```

## 📋 Structure du CSV enrichi

**Colonnes originales (13) :**
- video_id, Titre, URL, Vues, Duree, Likes, Commentaires
- Date_Publication, Description, Tags, Categorie_ID, Langue, Langue_Audio

**Nouvelles colonnes (3) :**
- **Categories** : Liste des catégories thématiques (séparées par virgule)
- **Intervenants** : Liste des intervenants détectés (séparés par virgule)
- **Tags_Propres** : Tags YouTube nettoyés (sans redondance)

## 🆚 Comparaison avec la version précédente

| Fonctionnalité | Version précédente | Version optimisée |
|----------------|-------------------|-------------------|
| Filtres catégories | Tags YouTube bruts | 8 catégories thématiques |
| Filtres intervenants | ❌ Aucun | ✅ 30+ intervenants |
| Filtre par date | ❌ Aucun | ✅ 6 options temporelles |
| Type de contenu | ✅ (inutilisé) | ❌ Supprimé |
| Tri par date | ❌ Aucun | ✅ Plus récentes par défaut |
| Classification | Manuelle | Automatique |
| Affichage intervenant | ❌ | ✅ |
| Affichage date | ❌ | ✅ |

## 💡 Utilisation

### Recherche basique
```
Tapez des mots-clés dans la barre de recherche
→ Recherche dans : titre, description, tags, catégories, intervenants
```

### Recherche avancée
```
1. Sélectionnez une catégorie (ex: "Viticulture")
2. Sélectionnez un intervenant (ex: "Marc-André Sélosse")
3. Choisissez une période (ex: "6 derniers mois")
4. Triez par pertinence (ex: "Plus récentes")
```

### Exemples de recherche
```
"couvert végétal" + Catégorie "Sol Vivant / ACS" + Intervenant "Konrad Schreiber"
→ Toutes les vidéos de Konrad Schreiber sur les couverts végétaux

Intervenant "François Mulet" + Date "Cette année"
→ Toutes les vidéos récentes de François Mulet

Catégorie "Élevage" + Tri "Vues (+ → -)"
→ Les vidéos d'élevage les plus populaires
```

## 🐛 Dépannage

### Les filtres ne s'affichent pas
- Vérifiez que `videos_ENRICHI.csv` est bien uploadé
- Vérifiez le nom exact : `videos_ENRICHI.csv` (sensible à la casse)

### Les catégories sont vides
- Le fichier CSV doit contenir les colonnes `Categories` et `Intervenants`
- Utilisez bien le fichier `videos_ENRICHI.csv` fourni

### Les vidéos ne se chargent pas
- Ouvrez la console JavaScript (F12)
- Vérifiez le message d'erreur
- Vérifiez que le CSV est bien encodé en UTF-8

## 📧 Support

Pour toute question ou amélioration, créez une issue sur GitHub.

## 🙏 Crédits

- **Vidéos** : Ver de Terre Production
- **Analyse automatique** : Script Python custom
- **Interface** : HTML/CSS/JavaScript vanilla

---

**Fait avec 💚 pour l'agroécologie**

Version optimisée - Novembre 2024
