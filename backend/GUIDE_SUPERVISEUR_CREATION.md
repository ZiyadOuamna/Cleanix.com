# Création d'un Superviseur - Guide Complet

## ℹ️ Important

Les **superviseurs ne font PAS de vérification d'email**. Ils accèdent directement au dashboard après connexion.

Seul le **contrôle d'accès par rôle** est appliqué (un superviseur ne peut pas accéder aux pages client/freelancer).

---

## Étape 1: Créer le Superviseur en Base de Données

Exécute le script SQL fourni dans `CREATE_SUPERVISEUR.sql`:

```bash
# Option 1: Via phpMyAdmin
# - Ouvre phpMyAdmin sur http://localhost/phpmyadmin
# - Sélectionne la base de données "cleanix"
# - Onglet "SQL"
# - Copie/colle le contenu de CREATE_SUPERVISEUR.sql
# - Clique "Exécuter"

# Option 2: Via ligne de commande
mysql -u root cleanix < CREATE_SUPERVISEUR.sql
```

**Identifiants par défaut dans le script:**
- Email: `admin@cleanix.com`
- Password: `Admin@123456`
- Genre: Homme
- Téléphone: +212612345678

---

## Étape 2: Se Connecter au Dashboard

1. **Go to** `http://localhost:3000/login`
2. **Email:** `admin@cleanix.com`
3. **Password:** `Admin@123456`
4. **Click:** "Se connecter"
5. ✅ **Redirection automatique vers `/superviseur/dashboard`**

**⚠️ ATTENTION:** Le superviseur sautera la page de vérification d'email et accèdera directement au dashboard.

---

## Étape 3: Changement de Mot de Passe Recommandé

Une fois connecté au dashboard:
1. **Aller à:** Paramètres → Sécurité
2. **Changer le mot de passe** `Admin@123456` par un mot de passe sécurisé

---

## Pour Créer Plusieurs Superviseurs

Duplique la section du script SQL et change:
- `nom`, `prenom`, `email`, `telephone`
- Garde le même hash de password ou génère un nouveau

**Exemple:**
```sql
INSERT INTO users (nom, prenom, email, password, genre, telephone, user_type, photo_profil, created_at, updated_at)
VALUES (
    'Manager',
    'Support',
    'manager@cleanix.com',
    '$2y$10$j/pNEJ4/4DqMrVq.ZNhVie3W7lIgPLVglLBD6EYfQ2kPx0I6wj1sC',
    'Femme',
    '+212612345679',
    'Superviseur',
    NULL,
    NOW(),
    NOW()
);

INSERT INTO superviseurs (user_id, niveau_acces, permissions, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email = 'manager@cleanix.com' LIMIT 1),
    'Superviseur',
    JSON_ARRAY('view_users', 'view_reports', 'manage_support', 'view_transactions'),
    NOW(),
    NOW()
);
```

Puis connecte-toi avec les identifiants créés.

---

## Sécurité

### Vérification d'Email
- ✅ **Client**: OBLIGATOIRE après inscription
- ✅ **Freelancer**: OBLIGATOIRE après inscription
- ✅ **Superviseur**: **DÉSACTIVÉE** (pas d'inscription, création directe en BD)

### Contrôle d'Accès
- ✅ Client ne peut accéder qu'à `/client/*`
- ✅ Freelancer ne peut accéder qu'à `/freelancer/*`
- ✅ Superviseur ne peut accéder qu'à `/superviseur/*`
- ✅ Tentative d'accès non autorisé → redirection vers le bon dashboard

---

## Dépannage

### Impossible de se connecter
1. Vérifie que l'email existe: 
   ```sql
   SELECT * FROM users WHERE email='admin@cleanix.com';
   ```
2. Vérifie que `user_type = 'Superviseur'`
3. Réexécute le script SQL

### Accès bloqué au dashboard
1. Vérifie l'erreur dans la console (F12)
2. Vérifie que `user_type` est correctement stocké dans localStorage
3. Vérifie que le token est valide

### Changement de rôle (Client → Superviseur, etc.)
1. **N'EST PAS SUPPORTÉ** - Un utilisateur ne peut avoir qu'un seul rôle
2. Si besoin, crée un nouveau compte avec le rôle désiré

---

✅ **Système de Superviseur 100% Sécurisé et Simplifié!**

