# 🛠️ GUIDE DE MISE EN PLACE

## Backend Setup

### 1. Exécuter les migrations
```bash
cd backend
php artisan migrate
```

**Résultat attendu:**
```
✅ 2024_12_11_create_user_settings_table
✅ 2024_12_11_create_bank_info_table
✅ 2024_12_11_create_wallets_table
✅ 2024_12_11_create_payment_methods_table
✅ 2024_12_11_create_support_tickets_table
✅ 2024_12_11_create_ticket_responses_table
✅ 2024_12_11_create_faqs_table
```

### 2. Créer des FAQ de test (optionnel)
```bash
php artisan tinker
```

Puis:
```php
App\Models\FAQ::create([
    'category' => 'Paiements',
    'question' => 'Quand vais-je recevoir mes paiements?',
    'answer' => 'Les paiements sont traités après la complétion du service et apparaissent dans votre portefeuille sous 8 heures ouvrables.',
    'active' => true,
    'order' => 1
]);

App\Models\FAQ::create([
    'category' => 'Paiements',
    'question' => 'Quels sont les frais de plateforme?',
    'answer' => 'Nous appliquons une commission de 15% sur chaque service pour les nouveaux freelancers.',
    'active' => true,
    'order' => 2
]);

exit
```

### 3. Vérifier que le serveur Laravel tourne
```bash
php artisan serve
```

Doit afficher:
```
Laravel development server started: http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Importer les nouveaux services dans les composants

**Dans settings.jsx (À faire):**
```javascript
import { getSettings, sendVerificationEmail, confirmEmailCode, updatePassword, ... } from '../../services/settingsService';
```

**Dans portefeuille.jsx (À faire):**
```javascript
import { getWallet, getTransactions, getPaymentMethods, requestWithdrawal } from '../../services/walletService';
```

**Dans support.jsx (À faire):**
```javascript
import { getFAQ, createSupportTicket, getUserTickets } from '../../services/supportService';
```

### 2. Ajouter useEffect pour charger les données

**Exemple Settings:**
```javascript
useEffect(() => {
  const loadSettings = async () => {
    try {
      const data = await getSettings();
      // Mettre à jour l'état avec les données
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  loadSettings();
}, []);
```

### 3. Remplacer les setTimeout par appels API

**Avant (Statique):**
```javascript
setTimeout(() => {
  // Simuler l'envoi du code
  setFormData(prev => ({...}));
}, 1500);
```

**Après (Dynamique):**
```javascript
const handleSendEmail = async () => {
  try {
    const response = await sendVerificationEmail(formData.email);
    if (response.success) {
      setFormData(prev => ({
        ...prev,
        emailVerification: { ...prev.emailVerification, codeSent: true }
      }));
    }
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message });
  }
};
```

---

## Tests des Endpoints

### Tester avec curl:

#### 1. Settings - Envoyer code email
```bash
curl -X POST http://localhost:8000/api/settings/send-email-code \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"freelancer@example.com"}'
```

#### 2. Wallet - Récupérer solde
```bash
curl -X GET http://localhost:8000/api/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. Support - Récupérer FAQ
```bash
curl -X GET "http://localhost:8000/api/support/faq?category=Paiements" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Support - Créer ticket
```bash
curl -X POST http://localhost:8000/api/support/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject":"Problème avec mon paiement",
    "message":"Je n'\''ai pas reçu mon paiement",
    "category":"Paiements"
  }'
```

---

## Vérification des Données

### PhpMyAdmin

1. Aller à: http://localhost/phpmyadmin
2. Sélectionner la base de données `cleanix`
3. Vérifier les tables créées:
   - `user_settings`
   - `bank_info`
   - `wallets`
   - `payment_methods`
   - `support_tickets`
   - `ticket_responses`
   - `faqs`

---

## Checklist d'Intégration

Frontend Settings:
- [ ] Importer settingsService
- [ ] Ajouter useEffect pour charger settings
- [ ] Remplacer sendVerificationEmail setTimeout
- [ ] Remplacer confirmEmailCode setTimeout
- [ ] Remplacer changePassword setTimeout
- [ ] Remplacer submitVerificationToSupervisor setTimeout
- [ ] Ajouter appels API pour notifications/privacy/availability

Frontend Wallet:
- [ ] Importer walletService
- [ ] Ajouter useEffect pour charger wallet
- [ ] Remplacer walletData statique
- [ ] Ajouter appel getPaymentMethods
- [ ] Implémenter requestWithdrawal

Frontend Support:
- [ ] Importer supportService
- [ ] Ajouter useEffect pour charger FAQ
- [ ] Remplacer handleSubmitTicket setTimeout
- [ ] Implémenter createSupportTicket

---

## Dépannage

### Erreur: "Table already exists"
```bash
# Ignorer - la table existe déjà
# Vous pouvez continuer
```

### Erreur: "CORS Error"
Assurez-vous que CORS est activé dans `config/cors.php`:
```php
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Erreur d'authentification
Vérifiez que:
1. Le token est dans `localStorage.getItem('auth_token')`
2. Le format du token est `auth_token|...` (Sanctum)
3. L'utilisateur est connecté

---

## Étapes Suivantes

1. ✅ Backend setup - FAIT
2. ⏳ Frontend integration - À faire
3. ⏳ Tests end-to-end - À faire
4. ⏳ Seeders & données - À faire

🚀 Prêt à démarrer l'intégration frontend!
