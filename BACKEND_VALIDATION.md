# Backend Validation Requirements - Laravel

Your Laravel backend already has most of what you need. Here's what to verify:

## Required Routes in `/routes/api.php`

### 1. User Validation Endpoint ✅
Make sure this exists:
```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'data' => $request->user(),
        'message' => 'User authenticated'
    ]);
});
```

**Used by**: `validateToken()` function to check token validity on app load

### 2. Logout Endpoint ✅
Make sure your logout implementation:
```php
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    Auth::guard('sanctum')->revoke();
    
    return response()->json([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
});
```

**Used by**: `logoutUser()` function when user clicks logout

### 3. Login Endpoint ✅
Ensure it returns token:
```php
Route::post('/login', [AuthController::class, 'login']);
```

Your AuthController.php should return:
```php
return response()->json([
    'success' => true,
    'data' => [
        'token' => $user->createToken('auth_token')->plainTextToken,
        'user' => $user
    ],
    'message' => 'Login successful'
]);
```

### 4. Register Endpoint ✅
Ensure it returns token:
```php
Route::post('/register', [AuthController::class, 'register']);
```

Should return similar to login.

## Checking Your Implementation

### View Current Routes
```bash
cd backend
php artisan route:list --path=api
```

### Check Auth Config
File: `backend/config/auth.php`
```php
'guards' => [
    'sanctum' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

### Verify Sanctum Installed
```bash
php artisan sanctum:install
php artisan migrate
```

### Check User Model Relationships
File: `backend/app/Models/User.php`
```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    // ... rest of model
}
```

## CORS Configuration for Frontend

File: `backend/config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => ['http://localhost:3000'],

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => ['*'],

'max_age' => 0,

'supports_credentials' => true,
```

## Testing the Security from Backend

### Test Token Validation
```bash
# 1. Get a valid token (login)
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Response should be:
# {
#   "data": {
#     "token": "auth_token|xxxxx",
#     "user": {...}
#   }
# }

# 2. Use token to verify it works
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer auth_token|xxxxx"

# Response should be: User data

# 3. Test invalid token
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer invalid_token"

# Response should be: 401 Unauthorized
```

### Test Logout
```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer auth_token|xxxxx"

# Response should be:
# {
#   "success": true,
#   "message": "Logged out successfully"
# }

# Then test with same token - should get 401
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer auth_token|xxxxx"

# Response should be: 401 Unauthorized
```

## What Happens When Token is Invalid

**In `ProtectedRoute.jsx`**:
```jsx
const token = localStorage.getItem('auth_token');
if (!token) {
  return <Navigate to="/login" replace />;
}
```

**In `validateToken()` function**:
```jsx
const response = await fetch('http://localhost:8000/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

if (!response.ok) {
  // Backend returned error (401, 403, etc)
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_type');
  return false;
}
```

## Troubleshooting

### Frontend says "No errors found" but routes don't work

**Check**:
1. Backend server running? `php artisan serve`
2. CORS enabled in Laravel?
3. Routes defined in `routes/api.php`?
4. Sanctum middleware applied correctly?

### Users can still access login page after logging in

**Check**:
1. PublicRoute component properly used in App.jsx?
2. Token actually stored in localStorage?
3. Browser dev tools → Application → LocalStorage

### Token validation always fails

**Check**:
1. Token format correct? Should be `auth_token|xxxxx`
2. `/api/user` endpoint returns authenticated user?
3. Bearer token properly added to header?
4. CORS allowing custom headers?

## Complete Auth Flow Diagram

```
User logs in
    ↓
Frontend sends POST /api/login
    ↓
Backend validates email/password
    ↓
Backend creates Sanctum token
    ↓
Backend returns token + user data
    ↓
Frontend stores in localStorage:
  - auth_token
  - user (JSON string)
  - user_type
    ↓
App.jsx calls validateToken()
    ↓
Frontend sends GET /api/user with token
    ↓
Backend validates token with Sanctum middleware
    ↓
Backend returns user if valid, 401 if invalid
    ↓
App.jsx sets isLoading = false
    ↓
ProtectedRoute checks localStorage
    ↓
User sees dashboard ✅
```

When logging out:
```
User clicks logout
    ↓
Frontend calls POST /api/logout with token
    ↓
Backend revokes token: Auth::guard('sanctum')->revoke()
    ↓
Backend returns success
    ↓
Frontend clears localStorage
    ↓
Frontend clears sessionStorage
    ↓
Frontend clears browser caches
    ↓
Frontend redirects to /login with replace: true
    ↓
User sees login page ✅
Token is now invalid on backend
```
