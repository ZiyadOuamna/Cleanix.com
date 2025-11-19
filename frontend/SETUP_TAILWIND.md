# 📋 Configuration Tailwind CSS - Projet Cleanix

### Étape 1 : Installer Tailwind v3 (version stable)
cd dans le dossier /frontend

npm install -D tailwindcss@^3.4.0 postcss autoprefixer


### Étape 2 : Initialiser Tailwind automatiquement

npx tailwindcss init -p

Cette commande crée automatiquement `tailwind.config.js` et `postcss.config.js`

### Étape 3 : Modifier `tailwind.config.js`
**IMPORTANT** : Remplacer `content: []` par :
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Étape 4 : Vérifier `postcss.config.js`
Doit contenir :
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Étape 5 : Vérifier `src/index.css`
Doit contenir ces 3 lignes :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
### Étape 6 : Démarrer le projet
supprimer le lien de tailwind dans public/index.html
      <!-- <script src="https://cdn.tailwindcss.com"></script> -->

### Étape 7 : Démarrer le projet
npm run start


## ✅ Résultat
Le projet devrait compiler sans erreurs !


**Note** : Exécuter toutes ces commandes dans le dossier `/frontend/`