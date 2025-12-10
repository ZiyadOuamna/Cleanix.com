# Orders/Commandes System Implementation Guide

## Overview
The Orders system has been fully implemented with backend API endpoints and frontend integration, inspired by the Indrive concept:

1. **Clients** create service requests
2. **Freelancers** receive orders and can propose prices
3. **Clients** can accept or reject price proposals
4. **Accepted orders** move to the "Accepted Orders" section for communication and work execution

## Backend Implementation

### Database Migrations
Two new migration files created:
- `2025_12_10_000000_create_orders_table.php` - Main orders table
- `2025_12_10_000001_create_order_proposals_table.php` - Price proposals table

### Models
- **Order** (`app/Models/Order.php`) - Represents a service request
- **OrderProposal** (`app/Models/OrderProposal.php`) - Represents a freelancer's price proposal

### API Endpoints
All routes protected with `auth:sanctum` middleware in `routes/api.php`:

#### Orders Management
- `GET /orders/received` - Get pending orders (Freelancer)
- `GET /orders/accepted` - Get accepted orders (Freelancer)
- `GET /orders/history` - Get order history
- `POST /orders` - Create new order (Client)
- `POST /orders/{id}/cancel` - Cancel order (Client)

#### Price Proposals
- `POST /orders/{id}/propose` - Propose price for order (Freelancer)
- `POST /proposals/{id}/accept` - Accept proposal (Client)
- `POST /proposals/{id}/reject` - Reject proposal (Client)
- `POST /proposals/{id}/cancel` - Cancel proposal (Freelancer)

#### Order Actions
- `POST /orders/{id}/start` - Start order (Freelancer)
- `POST /orders/{id}/complete` - Complete order (Freelancer)
- `POST /orders/{id}/review` - Add review (Client)

### Controller
**OrderController** (`app/Http/Controllers/OrderController.php`) contains all business logic

## Frontend Implementation

### Services
**orderService.jsx** - Centralized API client for all order-related operations
- `getReceivedOrders()` - Fetch pending orders
- `getAcceptedOrders()` - Fetch accepted orders
- `getOrderHistory()` - Fetch order history
- `proposePrice(orderId, proposalData)` - Submit price proposal
- `acceptProposal(proposalId)` - Accept a proposal
- `rejectProposal(proposalId)` - Reject a proposal
- And more...

### Components
- **ordersReceived.jsx** - Shows pending orders with ability to propose prices
- **acceptedCmd.jsx** - Shows accepted orders (ready for update)
- **historiqueCmd.jsx** - Shows order history (ready for update)

## Order Workflow

### From Client Perspective:
1. Create an order with service details and location
2. Receives proposals from freelancers
3. Accepts or rejects proposals
4. Once accepted, can communicate with freelancer
5. After completion, can leave review and rating

### From Freelancer Perspective:
1. Receives orders matching their services
2. Proposes a price (can be different from initial price)
3. Waits for client to accept/reject proposal
4. Once accepted, starts working on order
5. Completes order and uploads after photos
6. Can see reviews from clients

## Order Statuses

**Order Statuses:**
- `pending` - Waiting for freelancer responses
- `negotiating` - At least one proposal has been submitted
- `accepted` - Freelancer accepted by client
- `in_progress` - Work has started
- `completed` - Work finished, pending review
- `cancelled` - Order cancelled
- `rejected` - Freelancer declined

**Proposal Statuses:**
- `pending` - Waiting for client response
- `accepted` - Client accepted this proposal
- `rejected` - Client rejected this proposal
- `cancelled` - Freelancer cancelled this proposal

## Running Migrations

To create the tables in database:
```bash
cd backend
php artisan migrate
```

To roll back:
```bash
php artisan migrate:rollback
```

## Next Steps

1. **Update acceptedCmd.jsx** with:
   - Load accepted orders from API
   - Start/complete order functionality
   - Chat/messaging between client and freelancer

2. **Update historiqueCmd.jsx** with:
   - Load completed/cancelled orders from API
   - Show ratings and reviews
   - Export functionality

3. **Create OrderChat component** for real-time messaging

4. **Add Payment/Wallet integration** for transaction handling

5. **Implement Reviews & Rating system** in frontend

6. **Add Photo upload** for before/after images

## API Request Examples

### Propose a Price
```javascript
POST /api/orders/1/propose
{
  "proposed_price": 150,
  "description": "I can clean your apartment efficiently",
  "estimated_duration_hours": 3,
  "estimated_completion_date": "2025-12-15T14:00:00"
}
```

### Accept Proposal
```javascript
POST /api/proposals/5/accept
```

### Complete Order
```javascript
POST /api/orders/1/complete
{
  "notes": "Completed successfully",
  "photos_after": ["photo1.jpg", "photo2.jpg"]
}
```

### Add Review
```javascript
POST /api/orders/1/review
{
  "rating": 5,
  "review": "Excellent work, very professional!"
}
```

## Error Handling

The service layer includes comprehensive error handling:
- Network errors
- Validation errors
- Authorization errors
- Server errors

All errors are caught and logged, with user-friendly messages displayed via SweetAlert2.

## Testing

After migrations run, test the endpoints using Postman/Insomnia:
1. Create an order as client
2. Get received orders as freelancer
3. Propose price on an order
4. Accept proposal as client
5. Complete order as freelancer
6. Add review as client
