# Quick Start Guide - Orders System

## Architecture Overview

```
Freelancer Dashboard
    ├── Orders Received (ordersReceived.jsx)
    │   └── Shows pending orders
    │   └── Freelancer can propose prices
    │   └── Fetches from: GET /api/orders/received
    │
    ├── Accepted Orders (acceptedCmd.jsx)
    │   └── Shows accepted orders being worked on
    │   └── Freelancer can mark as complete
    │   └── Fetches from: GET /api/orders/accepted
    │
    └── Order History (historiqueCmd.jsx)
        └── Shows completed/cancelled orders
        └── Displays reviews and ratings
        └── Fetches from: GET /api/orders/history
```

## Order Flow (Indrive-like System)

### Step 1: Client Creates Order
- Client posts service request with:
  - Service type
  - Description
  - Location
  - Initial price (optional)
  - Scheduled date

### Step 2: Freelancer Receives Order
- Order appears in "Orders Received" page
- Shows client info, service details, location
- Freelancer can:
  - Propose a different price
  - Add description/notes about the service
  - Estimate duration and completion date

### Step 3: Client Reviews Proposals
- Client sees all freelancer proposals
- Can accept or reject each proposal
- Once accepted, order moves to "Accepted Orders"

### Step 4: Work Execution
- Freelancer marked order as "in_progress"
- Both can communicate (messaging to be added)
- Can view location and service details

### Step 5: Order Completion
- Freelancer uploads "after" photos
- Marks order as complete
- Client receives notification

### Step 6: Review & Rating
- Client rates freelancer (1-5 stars)
- Client writes review
- Both can see history

## File Structure

```
backend/
├── app/
│   ├── Models/
│   │   ├── Order.php              (NEW)
│   │   └── OrderProposal.php       (NEW)
│   └── Http/Controllers/
│       └── OrderController.php     (NEW)
│
└── database/migrations/
    ├── *create_orders_table.php                (NEW)
    └── *create_order_proposals_table.php       (NEW)

frontend/src/
├── services/
│   └── orderService.jsx            (NEW)
│
└── pages/freelancer/commandes/
    ├── ordersReceived.jsx          (UPDATED)
    ├── acceptedCmd.jsx             (READY FOR UPDATE)
    └── historiqueCmd.jsx           (READY FOR UPDATE)
```

## State Flow

```
ordersReceived.jsx
├── useState: orders, selectedOrder, showProposalModal
├── useEffect: fetchOrders() on mount
├── handleSubmitProposal: proposePrice() API call
└── Renders: Order cards with "Propose Price" button

ProposePrice Modal
├── Inputs: price, duration, completion_date, description
├── Validation: Price required
└── Submit: proposePrice(orderId, proposalData)
```

## Key Components

### OrdersReceived Component
```jsx
- Load orders from API
- Filter by status (pending/negotiating)
- Show client details and order info
- Open modal to propose price
- Submit proposal with validation
```

### Theme System
```javascript
const theme = {
  wrapperBg: isDarkMode ? 'bg-gray-900' : 'bg-slate-50',
  cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
  textMain: isDarkMode ? 'text-white' : 'text-slate-900',
  textSecondary: isDarkMode ? 'text-gray-400' : 'text-slate-600',
  // ... more theme variables
};
```

Supports both light and dark modes automatically!

## API Response Examples

### GET /api/orders/received
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "client_id": 2,
      "freelancer_id": null,
      "service_type": "Nettoyage complet",
      "description": "Apartment cleaning needed",
      "location": "123 Rue de Paris, 75001",
      "initial_price": 85.00,
      "agreed_price": null,
      "scheduled_date": "2025-12-15T10:00:00",
      "status": "pending",
      "proposals": [],
      "client": {
        "id": 2,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com",
        "rating": 4.5
      }
    }
  ]
}
```

### POST /api/orders/1/propose
```json
{
  "proposed_price": 100,
  "description": "I will do excellent work",
  "estimated_duration_hours": 3,
  "estimated_completion_date": "2025-12-15T14:00:00"
}
```

Response:
```json
{
  "success": true,
  "message": "Price proposal submitted successfully",
  "data": {
    "id": 5,
    "order_id": 1,
    "freelancer_id": 3,
    "proposed_price": 100,
    "status": "pending",
    "created_at": "2025-12-10T15:30:00"
  }
}
```

## Testing Checklist

- [ ] Run migrations: `php artisan migrate`
- [ ] Verify tables created in database
- [ ] Test register client and freelancer
- [ ] Test login with both user types
- [ ] Create order as client
- [ ] Fetch orders as freelancer (GET /orders/received)
- [ ] Propose price as freelancer
- [ ] See proposal in client dashboard (next step)
- [ ] Accept/reject proposal as client
- [ ] Order moves to accepted list
- [ ] Complete order as freelancer
- [ ] See in history as client
- [ ] Add review as client

## Troubleshooting

### "Unauthorized" Error
- Check auth_token in localStorage
- Verify user_type matches (Freelancer, Client)
- Check middleware in route

### "Order not found" Error
- Verify order ID exists in database
- Check order belongs to current user

### API Connection Issues
- Verify backend running on http://127.0.0.1:8000
- Check CORS configuration in backend
- Review browser console for exact errors

### Form Validation Errors
- Price must be filled
- All required fields must have values
- Date must be in future

## Next Priority Tasks

1. **Update acceptedCmd.jsx** - Load accepted orders from API
2. **Create OrderDetail page** - Show full order conversation
3. **Implement Real-time Chat** - For client-freelancer communication
4. **Add Payment Integration** - Connect to wallet/payment system
5. **Photo Upload** - Store before/after photos in storage
6. **Notifications** - Real-time updates for order status changes
7. **Maps Integration** - Show location on map

## Important Notes

⚠️ **Migration Step:**
```bash
cd backend
php artisan migrate
```

✅ **Verify Installation:**
```bash
# Check if migrations ran
php artisan migrate:status

# Check if routes are available
php artisan route:list | grep orders
```

📝 **Documentation:**
- See ORDERS_IMPLEMENTATION.md for detailed API docs
- See individual component files for inline comments

🔒 **Security:**
- All routes protected with Sanctum authentication
- User type validation on each endpoint
- Cannot modify orders they don't own
