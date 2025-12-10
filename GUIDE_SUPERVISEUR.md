# Guide Complet: Création et Connexion d'un Superviseur

## Problème Identifié

Le superviseur ne pouvait pas être créé normalement car:
1. L'enregistrement (register) était limité à Client et Freelancer uniquement
2. Il n'y avait pas de méthode pour créer un superviseur via l'API
3. Pas de guide pour créer un superviseur via la base de données

## Solutions Fournies

### Solution 1: Via Commande Artisan (Recommandée - Locale)

**Commande interactive:**
```bash
php artisan superviseur:create
```

Le système demandera:
- Email
- Mot de passe
- Nom
- Prénom
- Téléphone
- Genre (Homme/Femme)

**Avec options:**
```bash
php artisan superviseur:create \
  --email=admin@cleanix.com \
  --password=SecurePassword123 \
  --nom=Admin \
  --prenom=Superviseur \
  --telephone=+212612345678
```

### Solution 2: Via SQL Directement (Base de Données)

**Pas 1:** Ouvrir phpMyAdmin ou MySQL Workbench

**Pas 2:** Exécuter le script SQL fourni (`CREATE_SUPERVISEUR.sql`):

```sql
-- 1. Créer l'utilisateur Superviseur
INSERT INTO users (nom, prenom, email, password, genre, telephone, user_type, photo_profil, created_at, updated_at)
VALUES (
    'Admin',
    'Superviseur',
    'admin@cleanix.com',
    -- Mot de passe: Admin@123456 (hashé avec bcrypt)
    '$2y$10$j/pNEJ4/4DqMrVq.ZNhVie3W7lIgPLVglLBD6EYfQ2kPx0I6wj1sC',
    'Homme',
    '+212612345678',
    'Superviseur',
    NULL,
    NOW(),
    NOW()
);

-- 2. Créer le profil superviseur
INSERT INTO superviseurs (user_id, niveau_acces, permissions, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@cleanix.com' LIMIT 1),
    'Superviseur',
    JSON_ARRAY('view_users', 'view_reports', 'manage_support', 'view_transactions'),
    NOW(),
    NOW()
);
```

**Important:** Le mot de passe `$2y$10$j/pNEJ4/4DqMrVq.ZNhVie3W7lIgPLVglLBD6EYfQ2kPx0I6wj1sC` correspond à: **Admin@123456**

### Solution 3: Via API (Superviseur existant crée d'autres superviseurs)

**Endpoint:** `POST /api/create-superviseur`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Admin",
  "prenom": "Manager",
  "email": "admin2@cleanix.com",
  "password": "SecurePassword123",
  "genre": "Homme",
  "telephone": "+212612345679",
  "niveau_acces": "Manager",
  "permissions": ["view_users", "view_reports", "manage_support"]
}
```

**Réponse Success (201):**
```json
{
  "success": true,
  "message": "Superviseur created successfully",
  "data": {
    "user": {
      "id": 10,
      "name": "Manager Admin",
      "email": "admin2@cleanix.com",
      "user_type": "Superviseur",
      "telephone": "+212612345679",
      "genre": "Homme"
    }
  }
}
```

---

## Connexion au Superviseur

### Credentials par Défaut (si créé via SQL):
- **Email:** admin@cleanix.com
- **Mot de passe:** Admin@123456

### Processus de Connexion Frontend:

1. **Aller à la page de login** (`/login`)
2. **Remplir les identifiants:**
   - Email: `admin@cleanix.com`
   - Mot de passe: `Admin@123456`
3. **Cliquer sur "Se connecter"**

### Réponse du Serveur à la Connexion:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Superviseur Admin",
      "email": "admin@cleanix.com",
      "user_type": "Superviseur",
      "telephone": "+212612345678",
      "superviseur": {
        "id": 1,
        "user_id": 1,
        "niveau_acces": "Superviseur",
        "permissions": ["view_users", "view_reports", "manage_support", "view_transactions"]
      }
    },
    "token": "auth_token|xxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

---

## Vérification et Dépannage

### Vérifier qu'un Superviseur Existe:

**Dans la base de données:**
```sql
SELECT u.id, u.name, u.email, u.user_type, s.niveau_acces
FROM users u
LEFT JOIN superviseurs s ON u.id = s.user_id
WHERE u.user_type = 'Superviseur';
```

**Via API (une fois connecté):**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/user
```

### Problèmes Courants et Solutions:

#### Problème 1: "Email already exists"
**Cause:** L'email existe déjà dans la table users
**Solution:** 
```sql
DELETE FROM users WHERE email = 'admin@cleanix.com';
DELETE FROM superviseurs WHERE user_id = (SELECT id FROM users WHERE email = 'admin@cleanix.com' LIMIT 1);
```

#### Problème 2: "This action is only available for superviseurs"
**Cause:** L'utilisateur connecté n'est pas un superviseur
**Solution:** Se connecter avec un compte superviseur valide

#### Problème 3: "Telephone already exists"
**Cause:** Le numéro de téléphone est déjà utilisé
**Solution:** Utiliser un numéro différent ou le modifier dans la base de données

#### Problème 4: Le superviseur n'apparaît pas après la création
**Cause:** Deux tables doivent être créées (users + superviseurs)
**Solution:** Vérifier que les deux INSERT ont été exécutés:
```sql
-- Vérifier la table users
SELECT * FROM users WHERE email = 'admin@cleanix.com';

-- Vérifier la table superviseurs
SELECT * FROM superviseurs WHERE user_id = (SELECT id FROM users WHERE email = 'admin@cleanix.com');
```

---

## Structure des Données

### Table users:
```
id           INT PRIMARY KEY
nom          VARCHAR
prenom       VARCHAR
email        VARCHAR UNIQUE
password     VARCHAR (hashé)
user_type    ENUM('Client', 'Freelancer', 'Support', 'Superviseur')
genre        ENUM('Homme', 'Femme')
telephone    VARCHAR UNIQUE
photo_profil VARCHAR (nullable)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

### Table superviseurs:
```
id             INT PRIMARY KEY
user_id        INT FOREIGN KEY (users.id)
niveau_acces   VARCHAR ('Admin', 'Manager', 'Superviseur')
permissions    JSON (array de permissions)
created_at     TIMESTAMP
updated_at     TIMESTAMP
```

---

## Permissions Disponibles

Les permissions possibles pour un superviseur:
- `view_users` - Voir les utilisateurs
- `view_reports` - Voir les rapports
- `manage_support` - Gérer le support
- `view_transactions` - Voir les transactions
- `manage_freelancers` - Gérer les freelancers
- `manage_clients` - Gérer les clients
- `manage_commandes` - Gérer les commandes

---

## Résumé des Changements

### Fichiers Créés:
1. ✅ `backend/app/Console/Commands/CreateSuperviseur.php` - Commande Artisan
2. ✅ `backend/CREATE_SUPERVISEUR.sql` - Script SQL prêt à utiliser

### Fichiers Modifiés:
1. ✅ `backend/app/Http/Controllers/AuthController.php` - Ajout de `createSuperviseur()`
2. ✅ `backend/routes/api.php` - Ajout de la route `/create-superviseur`

### Fonctionnalités Ajoutées:
- ✅ Commande Artisan pour créer un superviseur localement
- ✅ Route API pour créer des superviseurs (authentifiés seulement)
- ✅ Script SQL pour insérer manuellement un superviseur
- ✅ Support complet de la connexion superviseur
- ✅ Validation et gestion d'erreurs

---

## Prochaines Étapes Recommandées

1. **Créer le premier superviseur** via l'une des 3 méthodes
2. **Tester la connexion** avec les identifiants fournis
3. **Vérifier les permissions** dans la base de données
4. **Créer des superviseurs supplémentaires** via l'API si nécessaire
5. **Implémenter le dashboard superviseur** pour gérer les utilisateurs et les rapports
