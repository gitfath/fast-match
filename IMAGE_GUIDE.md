# Guide des Images pour Fast Match

## ✨ Arrière-plan actuel

**Bonne nouvelle !** Un magnifique dégradé de couleurs est déjà actif comme arrière-plan. Votre site est donc **déjà visuellement attractif** même sans image.

Si vous souhaitez ajouter une photo de couples en arrière-plan, suivez les instructions ci-dessous.

## 🎨 Optimisations appliquées

L'arrière-plan est maintenant **parfaitement optimisé** :
- ✅ **Centré** sur tous les écrans (mobile, tablette, desktop, ultra-wide)
- ✅ **Responsive** : s'adapte automatiquement à la taille de l'écran
- ✅ **Performance mobile** : `background-attachment: scroll` sur mobile pour éviter les lags
- ✅ **Dégradé magnifique** : Si l'image ne charge pas, un beau dégradé violet-rose-orange s'affiche
- ✅ **Overlay coloré** : L'image aura un filtre violet-rose pour rester cohérent avec votre charte
- ✅ **100vh/100dvh** : Couvre toujours 100% de la hauteur de l'écran

---

## Images nécessaires pour la page d'accueil

### 1. Image de fond principale (Hero Background) - OPTIONNEL
**Chemin:** `/public/images/background.jpg.png`

> **Note:** Le fichier s'appelle `background.jpg.png` dans le code actuel. Vous pouvez le renommer en `background.jpg` si vous préférez.

**Spécifications:**
- Dimensions: 1920x1080px minimum (ou plus grand pour les écrans 4K)
- Format: JPG ou WebP (WebP recommandé pour la performance)
- Poids: < 500KB (optimisé)

**Contenu recommandé:**
- Couples africains jeunes (20-30 ans)
- Diversité de styles et de teintes de peau
- Sourires naturels et authentiques
- Lumière chaude (golden hour)
- Pas trop posé, moments naturels
- Ambiance romantique mais accessible

**Sources gratuites:**
- [Unsplash.com](https://unsplash.com) (recherche: "african couple", "young love", "romantic")
- [Pexels.com](https://pexels.com) (recherche: "african dating", "couple smiling")
- [Pixabay.com](https://pixabay.com)

### 2. Images alternatives (optionnel)

**Pour les témoignages:**
- `/public/images/testimonial-1.jpg`
- `/public/images/testimonial-2.jpg`
- `/public/images/testimonial-3.jpg`

**Spécifications:**
- Dimensions: 400x400px
- Format: JPG
- Poids: < 100KB chacune

---

## Comment ajouter les images

### Étape 1: Créer le dossier
```bash
# Dans le dossier frontend
mkdir -p public/images
```

### Étape 2: Télécharger vos images
Téléchargez vos images depuis les sources recommandées ci-dessus.

### Étape 3: Optimiser les images
Utilisez ces outils gratuits pour optimiser vos images :
- [TinyPNG.com](https://tinypng.com) - Compression sans perte de qualité
- [Squoosh.app](https://squoosh.app) - Conversion WebP et compression avancée

### Étape 4: Placer les images
Copiez vos images optimisées dans `frontend/public/images/`

### Étape 5: Renommer si nécessaire
Si votre image s'appelle `background.jpg` au lieu de `background.jpg.png`, mettez à jour le CSS :

Dans `frontend/app/globals.css`, ligne ~43, changez :
```css
url('/images/background.jpg.png')
```
en :
```css
url('/images/background.jpg')
```

---

## L'arrière-plan est déjà parfait !

Même **sans ajouter d'image**, votre site a déjà un arrière-plan magnifique avec :
- Un dégradé moderne violet → rose → orange
- Un overlay qui s'adapte à votre charte graphique
- Une performance optimale sur tous les appareils

**Vous pouvez laisser tel quel ou ajouter une image de couples pour plus d'authenticité.**

---

## Recommandations de design

✅ **À faire:**
- Images authentiques et naturelles
- Diversité représentée
- Haute qualité mais pas trop "stock photo"
- Optimisation pour le web (compression)
- Tester sur mobile ET desktop

❌ **À éviter:**
- Images trop sexualisées
- Photos trop artificielles
- Watermarks visibles
- Fichiers trop lourds (> 500KB)
- Images pixelisées ou de mauvaise qualité
