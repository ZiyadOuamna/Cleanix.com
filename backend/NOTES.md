# Notes du projet Cleanix

## 🔐 Authentification (Feature: authentication-meriem)

### Implémentation
- **Framework**: Laravel Sanctum
- **Type**: API Authentication avec tokens
- **Stateless**: Oui (pas de sessions)

### Endpoints créés

#### Routes Publiques (sans authentification)
1. `POST /api/auth/register` - Enregistrement utilisateur
   - Paramètres: nom, prenom, email, password, genre, telephone, user_type
   - Retour: user + token
   
2. `POST /api/auth/login` - Connexion
   - Paramètres: email, password
   - Retour: user + token
   
3. `POST /api/forgot-password` - Demander réinitialisation
   - Paramètres: email
   
4. `POST /api/reset-password` - Réinitialiser le mot de passe
   - Paramètres: email, token, password

#### Routes Protégées (authentification requise)
1. `GET /api/user` - Récupérer l'utilisateur connecté
2. `POST /api/auth/logout` - Se déconnecter
3. `POST /api/auth/refresh-token` - Renouveler le token
4. `PUT /api/user/profile` - Modifier le profil
5. `POST /api/user/change-password` - Changer le mot de passe

### Types d'utilisateurs
- **Client**: Crée un enregistrement dans `clients` table
- **Freelancer**: Crée un enregistrement dans `freelancers` table avec statut_disponibilite = 'Offline'
- **Support**: Crée un enregistrement dans `supports` table
- **Superviseur**: Crée un enregistrement dans `superviseurs` table avec niveau_acces = 'Superviseur'

### Modifications Base de Données

#### Table Users (migration 2014_10_12_000000)
Champs ajoutés/modifiés:
- `nom` - Nom de famille
- `prenom` - Prénom
- `email` - Email unique
- `password` - Mot de passe hashé
- `telephone` - Numéro unique
- `genre` - Enum: Homme/Femme
- `user_type` - Enum: Client/Freelancer/Support/Superviseur
- `photo_profil` - Nullable

#### Tables spécifiques créées
1. **clients** - Adresse, ville, code_postal
2. **freelancers** - Statut, note, disponibilité, missions, avis
3. **supports** - Département, disponibilité, tickets traités
4. **superviseurs** - Niveau d'accès, permissions

### Configuration
- **CORS**: Configuré pour localhost:3000 (frontend React)
- **Sanctum**: Tokens sans expiration (peut être modifié dans config/sanctum.php)
- **DB**: MySQL (cleanix database)

### Fichiers créés/modifiés
- ✅ `app/Http/Controllers/AuthController.php` - Contrôleur d'authentification
- ✅ `app/Models/User.php` - Modèle utilisateur avec relations
- ✅ `routes/api.php` - Routes API
- ✅ `database/migrations/2014_10_12_000000_create_users_table.php` - Mise à jour table users
- ✅ `Cleanix-Auth-API.postman_collection.json` - Collection Postman pour tester

### Testing
Collection Postman incluant:
- 4 Registrations (Client, Freelancer, Support, Superviseur)
- 4 Logins (un pour chaque type)
- Endpoints de gestion de profil
- Endpoints de sécurité (changement mot de passe, reset, logout)

---

## 📊 Tables de données

### Table Users
-Pour la table Users j'ai changé telephone de client a users car c'est mieux 
-Aussi pour Client j'ai ajouter le champs code postal et ville 
- table freelancer : nombre_missions , nombre_avis

### Table Transaction
ajout de la table transaction :
Les colonnes expliquées simplement
1. id
2. portefeuille_id (lien vers le portefeuille)

Cette transaction appartient à quel portefeuille ?
Exemple : Transaction n°5 appartient au portefeuille de Ahmed

3. type (3 types possibles)
C'est le type d'opération :

credit = Gagner de l'argent

Le freelancer a terminé une mission → il reçoit 500 DH


debit = Dépenser de l'argent

Le freelancer paie une commission → on enlève 50 DH


retrait = Sortir l'argent vers sa banque

Le freelancer veut transférer 200 DH vers son compte bancaire réel

4. montant

Combien d'argent dans cette opération ?
Exemple : 500.00 DH, 50.00 DH, 200.00 DH

5. compte_bancaire

Uniquement pour les retraits
Vers quel compte bancaire envoyer l'argent ?
Exemple : "RIB-123456" ou "IBAN-FR76..."

6. statut (3 statuts possibles)

en_attente = En attente de validation par l'admin

Exemple : Freelancer demande un retrait, mais l'admin n'a pas encore validé


validee = Opération terminée et confirmée

Exemple : Admin a transféré l'argent, c'est fait


refusee = Opération refusée par l'admin

Exemple : Le compte bancaire était incorrect, retrait refusé


7. description

Une petite note pour expliquer l'opération
Exemple : "Paiement mission #45", "Commission plateforme", "Retrait vers compte personnel"

8. timestamps (created_at, updated_at)

Quand l'opération a été créée
Quand elle a été modifiée la dernière fois
