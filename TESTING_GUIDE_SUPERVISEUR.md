# 🧪 Guide Rapide de Test - Pages Superviseur Dynamiques

## 📋 Checklist Rapide

```
□ Backend serveur en cours (port 8000)
□ Frontend en cours (port 3000)
□ Superviseur connecté (email: cleanix.ma.contact@gmail.com)
□ Token d'authentification valide
```

---

## 🚀 Démarrage Rapide

### 1. Vérifier le serveur backend
```bash
curl http://localhost:8000/api/superviseur/clients \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Vérifier le frontend
```
http://localhost:3000/superviseur/gestion-users/clients
```

### 3. Vérifier la console navigateur
```
F12 → Console
- Vérifier aucune erreur CORS
- Vérifier aucune erreur d'import
```

---

## ✅ Tests Unitaires API (via Postman)

### 1. Login Superviseur
```
POST http://localhost:8000/api/login

Headers:
Content-Type: application/json

Body:
{
  "email": "cleanix.ma.contact@gmail.com",
  "password": "Admin@123456"
}

Response attendue:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "auth_token|xxxxx..."  ← COPIER CE TOKEN
  }
}
```

### 2. Lister les Clients
```
GET http://localhost:8000/api/superviseur/clients?page=1&search=&filter=all

Headers:
Authorization: Bearer auth_token|xxxxx...
Content-Type: application/json

Response attendue:
{
  "success": true,
  "data": {
    "data": [ {...}, {...}, ... ],
    "current_page": 1,
    "last_page": 5,
    "total": 45,
    "per_page": 10
  }
}
```

### 3. Créer un Client
```
POST http://localhost:8000/api/superviseur/clients

Headers:
Authorization: Bearer auth_token|xxxxx...
Content-Type: application/json

Body:
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@test.com",
  "telephone": "+212612345678",
  "genre": "Homme",
  "adresse": "123 Rue Test",
  "ville": "Casablanca",
  "code_postal": "20000",
  "password": "SecurePass123!",
  "user_type": "Client"
}

Response attendue:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "auth_token|xxxxx..."
  }
}
```

### 4. Modifier un Client
```
PUT http://localhost:8000/api/superviseur/clients/1

Headers:
Authorization: Bearer auth_token|xxxxx...
Content-Type: application/json

Body:
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.new@test.com",
  "telephone": "+212612345679",
  "genre": "Homme"
}

Response attendue:
{
  "success": true,
  "message": "Client updated successfully",
  "data": { ... }
}
```

### 5. Supprimer un Client
```
DELETE http://localhost:8000/api/superviseur/clients/1

Headers:
Authorization: Bearer auth_token|xxxxx...
Content-Type: application/json

Response attendue:
{
  "success": true,
  "message": "Client deleted successfully"
}
```

### 6. Récupérer Stats Dashboard
```
GET http://localhost:8000/api/superviseur/dashboard/stats

Headers:
Authorization: Bearer auth_token|xxxxx...
Content-Type: application/json

Response attendue:
{
  "success": true,
  "data": {
    "totalClients": 45,
    "totalFreelancers": 23,
    "totalOrders": 128,
    "totalRevenue": 45600.50
  }
}
```

---

## 🎮 Tests Manuels (Frontend)

### Test 1: Chargement de la page
```
1. Ouvrir http://localhost:3000/superviseur/gestion-users/clients
2. Vérifier que le spinner s'affiche
3. Vérifier que la liste se charge en 2-3 secondes
4. Vérifier que les clients s'affichent correctement
```

### Test 2: Recherche
```
1. Entrer un nom de client dans la barre de recherche
2. Vérifier que la liste se filtre en temps réel
3. Entrer un email
4. Vérifier le filtrage par email
```

### Test 3: Création
```
1. Cliquer le bouton "+ Ajouter un Client"
2. Remplir le formulaire
   - Prénom: Test
   - Nom: Utilisateur
   - Email: test@example.com
   - Téléphone: +212612345678
   - Genre: Homme
   - Ville: Casablanca
3. Cliquer "Ajouter"
4. Vérifier le message de succès
5. Vérifier que le client apparaît dans la liste
```

### Test 4: Modification
```
1. Cliquer l'icône ✏️ sur un client
2. Modifier le prénom
3. Cliquer "Modifier"
4. Vérifier le message de succès
5. Vérifier que le prénom est mis à jour
```

### Test 5: Suppression
```
1. Cliquer l'icône 🗑️ sur un client
2. Confirmer la suppression
3. Vérifier le message de succès
4. Vérifier que le client disparaît de la liste
```

### Test 6: Pagination
```
1. Aller à la page 1
2. Cliquer "Suivant"
3. Vérifier que la page change
4. Vérifier que nouveaux clients s'affichent
5. Cliquer "Précédent"
6. Vérifier le retour à la page 1
```

---

## 🔍 Dépannage

### Erreur: "Unauthorized"
```
Cause: Token invalide ou expiré
Solution:
1. Vérifier que le token est copié complètement
2. Vérifier que le header est: Authorization: Bearer {token}
3. Se reconnecter si le token a expiré
```

### Erreur: "CORS Error"
```
Cause: Problème de Cross-Origin
Solution:
1. Vérifier que backend est sur http://localhost:8000
2. Vérifier que le proxy est configuré dans frontend/package.json
3. Redémarrer le serveur frontend
```

### Erreur: "Network Error"
```
Cause: Backend pas accessible
Solution:
1. Vérifier que `php artisan serve` est en cours
2. Vérifier le port: http://localhost:8000
3. Vérifier la base de données est connectée
4. Vérifier les logs: backend/storage/logs/laravel.log
```

### Erreur: "Aucun client trouvé"
```
Possible Causes:
1. Aucun client en base de données
2. Recherche trop spécifique
Solution:
1. Créer un nouveau client via le formulaire
2. Vérifier la recherche (sensible à la casse?)
3. Vérifier le filtre de statut
```

---

## 📊 Résultats Attendus

### Après la charge initiale
```
Spinner visible pendant 1-2 secondes
↓
Table avec colonnes:
- Client (Nom + ID)
- Contact (Email + Téléphone)
- Date d'Inscription
- Actions (Éditer + Supprimer)
↓
10 clients par page (ou moins si < 10)
↓
Boutons Précédent/Suivant si totalPages > 1
```

### Après la création
```
Modal se ferme
↓
Message "Succès" s'affiche
↓
Liste se récharge automatiquement
↓
Nouveau client visible en haut de la liste
```

### Après la modification
```
Modal se ferme
↓
Message "Succès" s'affiche
↓
Données du client mises à jour dans le tableau
```

### Après la suppression
```
Confirmation demandée
↓
Après confirmation: message "Succès"
↓
Client disparaît de la liste
↓
Pagination se met à jour si nécessaire
```

---

## 🐛 Logs à Vérifier

### Frontend (Browser Console)
```
F12 → Console
Chercher:
- GET /api/superviseur/clients 200
- POST /api/superviseur/clients 201
- PUT /api/superviseur/clients/{id} 200
- DELETE /api/superviseur/clients/{id} 200
```

### Backend (Terminal)
```
cd backend
php artisan serve

Chercher les messages:
- [GuzzleHttp\Exception\RequestException]
- Client created successfully
- Client updated successfully
- Client deleted successfully
```

### Database Check
```bash
mysql -u root cleanix -e "SELECT COUNT(*) as total FROM clients;"
mysql -u root cleanix -e "SELECT * FROM users WHERE user_type='Client' LIMIT 5;"
```

---

## ✨ Checklist de Validation Finale

- [ ] Spinner affiche pendant chargement
- [ ] Clients chargent correctement depuis l'API
- [ ] Recherche fonctionne en temps réel
- [ ] Filtrage par statut fonctionne
- [ ] Pagination fonctionne (Précédent/Suivant)
- [ ] Création nouveau client fonctionne
- [ ] Modification client fonctionne
- [ ] Suppression client fonctionne
- [ ] Messages de succès/erreur affichés
- [ ] Aucune erreur dans la console
- [ ] Aucune erreur CORS
- [ ] Aucune erreur 401/403 (non autorisé)
- [ ] Données persistées en base de données

---

## 🎯 Objectifs pour Demain

1. ✅ Tester gestionClients (30 min)
2. ✅ Finaliser gestionFreelancers (1h)
3. ✅ Dynamiser gestionReclamations (1h)
4. ✅ Tester tous les CRUD (30 min)

**Temps Estimé Total**: 3 heures

---

**Date**: 12 Décembre 2025  
**Version**: 1.0  
**Auteur**: GitHub Copilot  
**Statut**: 🟢 PRÊT POUR TESTS
