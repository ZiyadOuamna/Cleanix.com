-- Script SQL pour créer un superviseur
-- À exécuter dans phpMyAdmin ou un client MySQL

-- 1. Créer l'utilisateur Superviseur dans la table users
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

-- 2. Récupérer l'ID du user créé
-- SELECT LAST_INSERT_ID() as user_id;

-- 3. Créer le profil superviseur (remplacez X par l'ID retourné)
-- Supposons que le user_id soit 1
INSERT INTO superviseurs (user_id, niveau_acces, permissions, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@cleanix.com' LIMIT 1),
    'Superviseur',
    JSON_ARRAY('view_users', 'view_reports', 'manage_support', 'view_transactions'),
    NOW(),
    NOW()
);

-- 4. Vérifier que tout est créé correctement
SELECT u.id, u.name, u.email, u.user_type, s.niveau_acces
FROM users u
LEFT JOIN superviseurs s ON u.id = s.user_id
WHERE u.email = 'admin@cleanix.com';

-- Autres exemples de superviseurs à créer:
/*
INSERT INTO users (nom, prenom, email, password, genre, telephone, user_type, photo_profil, created_at, updated_at)
VALUES (
    'Manager',
    'Support',
    'manager@cleanix.com',
    '$2y$10$j/pNEJ4/4DqMrVq.ZNhVie3W7lIgPLVglLBD6EYfQ2kPx0I6wj1sC', -- password: Admin@123456
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
    'Manager',
    JSON_ARRAY('view_users', 'view_reports', 'manage_support'),
    NOW(),
    NOW()
);
*/
