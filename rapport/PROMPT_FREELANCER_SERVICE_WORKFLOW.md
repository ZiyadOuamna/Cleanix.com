# Prompt pour Développer le Workflow de Services Freelancer (Dynamique & Backend)

## 🎯 Objectif Global
Créer un workflow complet et dynamique où :
1. **Freelancer** crée un compte → système inactif par défaut
2. **Freelancer** publie un service → superviseur peut voir la demande
3. **Superviseur** valide/rejette le service → devient actif dans le profil du freelancer
4. **Client** voit les services actifs → peut commander
5. **Système** met à jour profil, stats, et disponibilité en temps réel

---

## 📋 Context & Architecture Actuelle

### Fichiers Clés Existants
- **Backend**:
  - `backend/app/Models/Freelancer.php` (statut_disponibilite, competences, solde, etc.)
  - `backend/app/Models/User.php` (user_type: Client/Freelancer/Support/Superviseur)
  - `backend/app/Http/Controllers/AuthController.php` (register, createUserProfile)
  - `backend/routes/api.php` (routes API protégées par Sanctum)
  - `backend/database/migrations/` (créer migrations pour Services & ServiceRequests)

- **Frontend**:
  - `frontend/src/pages/freelancer/profileFreelancer.jsx` (onglet "services")
  - `frontend/src/pages/freelancer/services/gestionService.jsx` (gestion services)
  - `frontend/src/pages/superviseur/gestionUsers/gestionFreelancers.jsx` (tableau freelancers)
  - `frontend/src/pages/client/profileClient.jsx` (voir profils freelancers)

### Stack
- **Backend**: Laravel 11 + Sanctum (auth token)
- **Frontend**: React 19 + Vite + Tailwind
- **DB**: MySQL (migrations + seeders)

---

## 🔧 Fonctionnalités à Implémenter

### **1️⃣ Backend: Migrations & Models**

#### A. Créer Migration `freelancer_services`
```php
// Migration: create_freelancer_services_table
// Champs:
- id (PK)
- freelancer_id (FK → freelancers)
- title (string)
- description (text)
- category (string: 'Nettoyage résidentiel', 'Bureau', etc.)
- base_price (decimal)
- status (enum: 'draft' | 'pending_review' | 'active' | 'rejected')
- visibility (boolean: visible on profile or not)
- service_zones (JSON: ['Casablanca', 'Fès', ...])
- working_days (JSON: ['Lundi', 'Mardi', ...])
- included_items (JSON: liste items inclus)
- images (JSON: URLs photos service)
- created_at, updated_at
- reviewed_at (timestamp superviseur review)
- reviewed_by (user_id superviseur)
- rejection_reason (text: motif rejet)
```

#### B. Créer Model `FreelancerService`
```php
class FreelancerService extends Model {
  belongsTo Freelancer
  relationship: orders (hasMany)
  
  // Status Constants
  DRAFT = 'draft'
  PENDING_REVIEW = 'pending_review'
  ACTIVE = 'active'
  REJECTED = 'rejected'
  
  // Methods
  - isPendingReview()
  - isActive()
  - canBeReviewed()  // Seulement pending_review
  - approve(Freelancer $reviewer)  // Set active
  - reject($reason)  // Set rejected
}
```

#### C. Créer Migration `service_requests` (Tracking demandes superviseur)
```php
// Pour garder historique des demandes de validation service
- id
- freelancer_service_id
- action (approve/reject)
- supervisor_id
- action_date
- comment (optional)
```

---

### **2️⃣ Backend: Controllers & Routes**

#### A. Créer Controller `ServiceController`
```php
// Routes:
POST   /api/freelancer/services              → createService (Freelancer crée brouillon)
GET    /api/freelancer/services              → listMyServices (Freelancer voir ses services)
PUT    /api/freelancer/services/{id}         → updateService (Freelancer modifie brouillon/rejeté)
DELETE /api/freelancer/services/{id}         → deleteService
POST   /api/freelancer/services/{id}/publish → publishService (Freelancer → pending_review)
PUT    /api/freelancer/services/{id}/visibility → toggleVisibility

// Superviseur:
GET    /api/superviseur/services/pending     → getPendingServices
PUT    /api/superviseur/services/{id}/approve → approveService
PUT    /api/superviseur/services/{id}/reject  → rejectService

// Client:
GET    /api/services/active                  → getActiveServices (freelancer + service actif)
GET    /api/freelancer/{id}/services         → getFreelancerServices (services publics)
```

#### B. Logique Clé dans Controller

**createService()**
- Validé par freelancer auth (Sanctum)
- Crée `FreelancerService` avec status='draft'
- Retourne service ID + message "Brouillon sauvegardé"

**publishService()**
- Valide: title, description, category, base_price requis
- Change status 'draft' → 'pending_review'
- Crée `ServiceRequest` entry pour superviseur audit
- Retourne "Service envoyé au superviseur pour examen"

**approveService()** (superviseur seulement)
- Checke: status === 'pending_review'
- Change → 'active'
- Enregistre reviewer + date
- Notif Freelancer: "Votre service X est actif !"
- **Trigger**: Met à jour `Freelancer::competences` JSON (ajoute skill)

**rejectService()** (superviseur seulement)
- Change → 'rejected'
- Sauvegarde `rejection_reason`
- Retourne brouillon au freelancer pour modification
- Notif Freelancer: "Service X rejeté. Motif: ..."

---

### **3️⃣ Frontend: Freelancer Pages**

#### A. Créer Page `publishService.jsx`
(Onglet "Services" dans `profileFreelancer.jsx`)

**Layout**:
- **Section Brouillons**: Services status='draft'
  - Bouton: "Continuer la rédaction"
  - Bouton: "Publier"
  - Bouton: "Supprimer"
  
- **Section En Examen**: Services status='pending_review'
  - Badge jaune "En attente de validation superviseur"
  - Bouton désactivé "Publier" (en cours review)
  - Info: "Vous recevrez une notification quand le superviseur aura examiné"
  
- **Section Actifs**: Services status='active'
  - Badge vert "Actif"
  - Bouton: "Masquer du profil" (toggle visibility)
  - Stats: nombre commandes, rating client, earnings
  
- **Section Rejetés**: Services status='rejected'
  - Badge rouge "Rejeté"
  - Motif rejet affiché
  - Bouton: "Modifier & Renvoyer"

**Formulaire Création Service**:
- Title, description (riche editor)
- Category (dropdown: Résidentiel, Bureau, Spécialisé, Saisonnier, Après travaux)
- Base price (DH)
- Service zones (multi-select: villes)
- Working days (checkboxes: Lun-Dim)
- Included items (textarea: liste items)
- Image upload (max 5 photos)
- Save as Draft / Publish buttons

---

#### B. Modifier `gestionService.jsx`
(Déjà existe, mais ajouter intégration API)

**Changements**:
- Remplacer mock data par appels API GET `/api/freelancer/services`
- Ajouter bouton "Publier" qui fait POST `/api/freelancer/services/{id}/publish`
- Sur publish: afficher confirmation + notification SweetAlert2
- Gestion erreurs: si rejet, afficher motif + bouton "modifier"

---

### **4️⃣ Frontend: Superviseur - Gestion Services**

#### A. Créer Page `superviseurServiceValidation.jsx`
(Nouvelle page ou onglet dans gestionFreelancers)

**Layout**:
- **Onglets**:
  - "En attente" (status='pending_review') ← **Focus ici**
  - "Approuvés" (status='active')
  - "Rejetés" (status='rejected')

- **Tableau Services En Attente**:
  - Colonnes: Freelancer | Service | Catégorie | Prix | Date Demande | Actions
  - Clics sur ligne → Modal détail service
  
- **Modal Détail Service**:
  - Infos freelancer: avatar, nom, statut global
  - Détails service: title, description, zones, jours, items inclus
  - Images carousel (swipe left/right)
  - Boutons:
    - 🟢 **Approuver**: Confirmé → status='active', notif sent
    - 🔴 **Rejeter**: Modal raison rejet, confirmé → status='rejected'
    - 🔗 **Voir Profil**: Lien vers `gestionFreelancers` detail freelancer

---

### **5️⃣ Frontend: Superviseur - Intégration Gestion Freelancers**

#### A. Modifier `gestionFreelancers.jsx`

**Ajouter Section "Services du Freelancer"**:
- Quand détail freelancer ouvert:
  - Liste services (avec statut badges)
  - Bouton "Voir services en attente" → goto ServiceValidation page
  - Bouton "Voir tous les services"

---

### **6️⃣ Frontend: Client - Voir Services Freelancer**

#### A. Modifier `profileClient.jsx` → `profileFreelancer.jsx` (Public View)
(Quand client clique sur freelancer profile)

**Afficher Section "Services"**:
- Grid services status='active' + visibility=true
- Chaque service: title | price | categorie | zones | rating
- Cliq → modal "Demander ce service" 
- Bouton: "Commander ce service" → RequestService page

---

## 📊 Flux Données Complet

```
[FREELANCER ACCOUNT CREATED] (status=inactive)
       ↓
[FREELANCER PUBLISHES SERVICE] (status=pending_review)
       ↓
[SUPERVISEUR SEES PENDING SERVICES]
       ├→ [APPROVE] → status=active → competences Updated → notification sent
       │                    ↓
       │           [SERVICE VISIBLE ON PROFILE]
       │                    ↓
       │           [CLIENT SEES SERVICE → CAN ORDER]
       │
       └→ [REJECT] → status=rejected + reason → freelancer notified
                           ↓
                   [FREELANCER MODIFIES & REPUBLISHES]
                           ↓
                   [BACK TO SUPERVISEUR REVIEW]
```

---

## 🔐 Authorization Checks (Backend)

```php
// Avant chaque action:
- Freelancer services: Auth::user()->isFreelancer() && service->freelancer_id == Auth::id()
- Superviseur review: Auth::user()->isSuperviseur()
- Client view: status='active' && visibility=true
```

---

## 🔔 Notifications & UI Feedback

**Freelancer Notifications**:
- Email/Toast quand service approuvé → "Service actif, commandes arrivant!"
- Email/Toast quand rejeté → "Service rejeté. Raison: [text]"

**Superviseur UI**:
- Badge "3 services en attente" sur sidebar
- Toast confirmation approve/reject avec service name

**Client UI**:
- Services publiés dans liste search
- Voir profil freelancer → sections services actives

---

## 📝 Database Seed Example

```php
// DatabaseSeeder.php
$freelancer = Freelancer::find(1);

FreelancerService::create([
  'freelancer_id' => 1,
  'title' => 'Nettoyage Complet Résidentiel',
  'category' => 'Nettoyage résidentiel',
  'status' => 'active',  // Start with active for demo
  'base_price' => 450,
  'service_zones' => json_encode(['Casablanca', 'Fès', 'Rabat']),
  'working_days' => json_encode(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']),
]);
```

---

## ✅ Checklist Implémentation

### Backend
- [ ] Créer migration `freelancer_services`
- [ ] Créer migration `service_requests`
- [ ] Créer Model `FreelancerService`
- [ ] Créer Controller `ServiceController`
- [ ] Ajouter routes API (11 routes)
- [ ] Implémenter approve/reject logic
- [ ] Tests API (Postman/PHPUnit)

### Frontend
- [ ] Créer `publishService.jsx` (formulaire + gestion états)
- [ ] Modifier `gestionService.jsx` (intégrer API)
- [ ] Créer `superviseurServiceValidation.jsx` (modal review)
- [ ] Modifier `gestionFreelancers.jsx` (ajouter section services)
- [ ] Modifier `profileFreelancer.jsx` (afficher services publics)
- [ ] Modifier `requestService.jsx` (ajouter services dynamiques)
- [ ] Notifications SweetAlert2 (approve/reject/publish)

### Tests
- [ ] Créer freelancer account → check inactif
- [ ] Publier service → superviseur voit en attente
- [ ] Approuver service → visible sur profil + competences updated
- [ ] Rejeter service → freelancer notification + peut re-publish
- [ ] Client voir services actifs → peut commander

---

## 🚀 Commandes Setup Backend

```bash
cd backend

# Créer migrations
php artisan make:migration create_freelancer_services_table
php artisan make:migration create_service_requests_table

# Créer Model & Controller
php artisan make:model FreelancerService
php artisan make:controller ServiceController --api

# Exécuter migrations
php artisan migrate

# Tester API
php artisan serve
# Postman: http://127.0.0.1:8000/api/freelancer/services
```

---

## 📞 Support & Questions
- Repository: `feature/freelancer-service-workflow` (branche recommandée)
- Copilot Prompt: Copy-paste ce fichier dans Copilot quand tu codes
- Test: Toujours tester avec Postman avant frontend

---

**Good luck! Let me know if you need clarification on any workflow step.** 🎯
