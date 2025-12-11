# Rapport projet Cleanix

## 1. Presentation rapide
- Marketplace de services de nettoyage avec roles Client, Freelancer, Support, Superviseur.
- Stack : Laravel 11 (API) + React 19 (Vite) + Tailwind + Sanctum (auth par token).
- Base URL API locale : http://127.0.0.1:8000/api
- Proxy frontend : http://127.0.0.1:8000

## 2. Architecture
- Backend Laravel (dossier `backend/`)
  - Routes API : `backend/routes/api.php`
  - Auth : `backend/app/Http/Controllers/AuthController.php`, middleware Sanctum
  - Models : `User` + profils `Client`, `Freelancer`, `Support`, `Superviseur`
  - Transactions & portefeuille (escrow) : `Portefeuille.php`, logique dans controllers
  - Migrations/seeders : `backend/database/migrations`, `backend/database/seeders`
- Frontend React (dossier `frontend/`)
  - Entrée : `src/App.jsx`, routing React Router
  - Contexte/sessions : `src/context/`, `ClientContext`
  - Pages clients : `src/pages/client/`
  - Pages superviseur : `src/pages/superviseur/`
  - Services API : `src/services/` (authService, etc.)

## 3. Roles et parcours
- Client : inscription/login, gestion portefeuille, commandes, demandes de remboursement.
- Freelancer : gestion de profil, commandes recues/acceptations, portefeuille.
- Support/Superviseur : gestion utilisateurs, reclamations, remboursements, validations.

## 4. Authentification & securite
- Sanctum tokens stockes en localStorage (`auth_token`, `user`, `user_type`).
- Intercepteur Axios ajoute `Authorization: Bearer {token}` pour chaque requete.
- Routes publiques: register/login/reset-password. Routes protegees via `auth:sanctum`.
- CORS gere dans `backend/app/Http/Kernel.php` et config `cors.php`.

## 5. Base de donnees
- Table `users` avec colonne `user_type` (Client, Freelancer, Support, Superviseur).
- Tables specifiques par role (1:1) : `clients`, `freelancers`, `supports`, `superviseurs`.
- Transactions/portefeuille : fonds verrouilles, commissions (90% freelancer / 10% Cleanix).

## 6. Fonctionnalites clefs deja en place
- Portefeuille client : solde dispo, fonds verrouilles, historique, flux paiement en 3 etapes.
- Demandes de remboursement : bouton sur transactions et fonds verrouilles, modal avec motif + description, envoi au superviseur.
- Tableau de bord superviseur remboursements : filtres, stats, approbation individuelle ou bulk.
- SweetAlert2 theming dark/light, interactions coherentes.

## 6.1 Fonctionnalites en developpement (Workflow Services Freelancer)
- Freelancer publie services → superviseur valide avant activation
- Services actifs apparaissent sur profil freelancer et visibles aux clients
- Superviseur peut approuver/rejeter demandes service avec motif
- Notifications client/freelancer/superviseur sur statut service
- Stats dynamiques: nombre commandes, earnings par service

## 7. Commandes de setup
- Backend :
  - `cd backend`
  - `composer install`
  - Configurer `.env` (DB, MAIL, SANCTUM)
  - `php artisan migrate --seed`
  - `php artisan serve`
- Frontend :
  - `cd frontend`
  - `npm install`
  - `npm start` (React Scripts) ou `npm run dev` (Vite si configure)

## 8. Tests
- Backend : `cd backend && php artisan test`
- Frontend : `cd frontend && npm test`

## 9. Points de securite a documenter
- Validation cote serveur via `$request->validate()`.
- Tokens Sanctum uniquement sur routes protegees.
- Stockage fichiers (photos) sur disque public avec chemins retournes dans API.
- Logs d erreurs via `backend/storage/logs`.

## 10. Check-list rapport (a completer)
- Objectifs du projet et scope fonctionnel
- Diagramme d architecture (API + Front + DB)
- Parcours utilisateurs par role
- Flux de paiement et escrow (inclure commissions, fonds verrouilles, remboursements)
- Politique de remboursement (conditions et workflows)
- Securite (auth, autorisations, CORS, validation, stockage tokens)
- Setup et prerequis (versions PHP, Node, MySQL)
- Tests realises et couverture
- Roadmap et next steps

## 11. Annexes (references fichiers)
- Routes API : `backend/routes/api.php`
- Auth : `backend/app/Http/Controllers/AuthController.php`
- Models : `backend/app/Models/`
- Portefeuille client : `frontend/src/pages/client/walletClient.jsx`
- Remboursements superviseur : `frontend/src/pages/superviseur/gestionRembourssements.jsx`
- Services API : `frontend/src/services/`

## 12. Workflow Services Freelancer (A Implémenter)
Voir fichier détaillé: `rapport/PROMPT_FREELANCER_SERVICE_WORKFLOW.md`
- Freelancer crée service (draft) → publie (pending_review)
- Superviseur valide/rejette → notification freelancer
- Service actif apparait sur profil → clients peuvent commander
- Specs complètes: backend (migrations, models, controllers, routes), frontend (pages, modals, API calls)
