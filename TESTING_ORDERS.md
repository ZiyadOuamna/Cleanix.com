# Testing the Orders System

## Test Credentials (Seeded Data)

### Client Account
- **Email**: `client@test.com`
- **Password**: `password`
- **Name**: Jean Dupont

### Freelancer Account
- **Email**: `freelancer@test.com`
- **Password**: `password`
- **Name**: Marie Martin

## Test Orders Available

3 test orders have been seeded in the database:

### Order #1: Nettoyage complet
- **Location**: 123 Rue de Paris, 75001 Paris
- **Initial Price**: 85 DH
- **Date**: In 3 days at 10:00 AM
- **Description**: Besoin d'un nettoyage complet de mon appartement. Tous les détails inclus.

### Order #2: Nettoyage de vitres
- **Location**: 456 Avenue des Champs, 75008 Paris
- **Initial Price**: 120 DH
- **Date**: In 5 days at 14:00 (2:00 PM)
- **Description**: Nettoyage des vitres de mon bureau. Environ 20 vitres.

### Order #3: Nettoyage après travaux
- **Location**: 789 Boulevard Saint-Germain, 75006 Paris
- **Initial Price**: 200 DH
- **Date**: In 7 days at 09:00 AM
- **Description**: Nettoyage complet après travaux de rénovation. Très sales.

## Step-by-Step Test Flow

### Step 1: Test as Client
1. Go to http://localhost:3000
2. Click Login
3. Enter credentials:
   - Email: `client@test.com`
   - Password: `password`
4. You should see the client dashboard

### Step 2: Test as Freelancer
1. Logout from client account
2. Go to http://localhost:3000/login
3. Enter freelancer credentials:
   - Email: `freelancer@test.com`
   - Password: `password`
4. You should see the freelancer dashboard

### Step 3: View Orders Received
1. As freelancer, click "Mes Commandes" in sidebar
2. Click "Commandes Reçues" submenu
3. You should see the 3 test orders listed
4. Each card shows:
   - Client name (Jean Dupont)
   - Service type
   - Location
   - Initial price
   - Description

### Step 4: Propose a Price
1. Click "Proposer un prix" button on any order
2. Fill in the modal:
   - **Votre prix (DH)**: Enter a price (e.g., 95, 110, etc.)
   - **Durée estimée (heures)**: Optional (e.g., 3)
   - **Date estimée de réalisation**: Optional (pick a date/time)
   - **Description**: Describe your service approach
3. Click "Envoyer"
4. Should see success message
5. Proposal appears in the order card showing status

### Step 5: View Accepted Orders
1. (Once orders are accepted through client dashboard - coming next)
2. Click "Commandes Acceptées" in sidebar
3. Shows orders where this freelancer was selected

### Step 6: View Order History
1. Click "Historique" in sidebar
2. Shows completed, cancelled, or rejected orders

## Expected Behavior

### When Viewing Orders Received
✅ See all 3 test orders
✅ See client name, rating, and completed orders count
✅ See service type and description
✅ See location with map icon
✅ See proposed price
✅ See scheduled date and time
✅ Can propose different prices

### When Proposing Price
✅ Modal opens with client info
✅ Price field is required
✅ Can submit without other fields
✅ On success:
   - Get success alert
   - Proposal shows in order card with "pending" status
   - Can propose again (multiple proposals per order)

### Dark/Light Mode
✅ Toggle works
✅ All colors adapt correctly
✅ Text remains readable

## Troubleshooting

### "Cannot read property 'map' of undefined"
- **Cause**: Orders not loading from API
- **Fix**: 
  - Check if backend is running (http://127.0.0.1:8000)
  - Check browser console for API errors
  - Verify token in localStorage
  - Run `php artisan migrate:fresh --seed` again

### "Unauthorized" error
- **Cause**: Auth token missing or expired
- **Fix**: 
  - Logout and login again
  - Check localStorage has `auth_token`
  - Verify token format: `auth_token|xxxxx`

### Client name shows as "C" or "Client"
- **Cause**: nom/prenom fields empty in users table
- **Fix**: Already fixed in frontend - uses both `nom` and `prenom` fields

### Orders not appearing
- **Cause**: 
  - Seeder didn't run
  - Or freelancer viewing client's own orders
- **Fix**:
  - Check user type in database
  - Ensure logged in as "Freelancer" type
  - Run seeder: `php artisan db:seed`

## Testing API Directly with Postman

### 1. Login as Freelancer
```
POST http://127.0.0.1:8000/api/login
{
  "email": "freelancer@test.com",
  "password": "password"
}
```
Response will include `token` - copy this value

### 2. Get Received Orders
```
GET http://127.0.0.1:8000/api/orders/received
Headers:
  Authorization: Bearer {token_from_login}
```

### 3. Propose Price
```
POST http://127.0.0.1:8000/api/orders/1/propose
Headers:
  Authorization: Bearer {token}
Body:
{
  "proposed_price": 100,
  "description": "Professional cleaning service",
  "estimated_duration_hours": 3,
  "estimated_completion_date": "2025-12-13T10:00:00"
}
```

## What's Next to Test

1. **acceptedCmd.jsx** - View accepted orders (not yet integrated)
2. **Client Dashboard** - Create new order
3. **Client Dashboard** - View proposals and accept/reject
4. **Message System** - Real-time chat (not yet implemented)
5. **Complete Order** - Upload photos and complete
6. **Add Review** - Rate and review freelancer

## Important Notes

⚠️ **Seeded Data Resets**
- If you run `php artisan migrate:fresh --seed` again, all data resets
- Test orders and users are recreated each time

⚠️ **Orders are "Pending" by Default**
- Status becomes "negotiating" when first proposal is submitted
- Status becomes "accepted" when client accepts a proposal

⚠️ **User Types Matter**
- Only "Freelancer" type users see received orders
- Only "Client" type users can create orders
- API validates user type for each endpoint

## Useful Laravel Commands

```bash
# Reset everything
php artisan migrate:fresh --seed

# Just seed
php artisan db:seed

# Check what's in DB
php artisan tinker
> User::all()
> Order::all()

# View routes
php artisan route:list | grep orders
```
