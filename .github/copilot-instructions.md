# Cleanix.com - AI Coding Agent Instructions

## Architecture Overview

**Cleanix** is a freelance marketplace for cleaning services with a multi-role system (Client, Freelancer, Support, Superviseur). The codebase uses a **Laravel backend** (API) and **React frontend** connected via Sanctum token authentication.

### Tech Stack
- **Backend**: Laravel 11 (PHP) with MySQL, Sanctum for API authentication
- **Frontend**: React 19 with Vite, Tailwind CSS, React Router v7
- **API Communication**: Axios with interceptor-based token management
- **Database**: Multi-model design with role-specific tables extending base `users` table

## Critical Architecture Patterns

### 1. Multi-Role User System
Users have a base `User` model with a `user_type` column (Client, Freelancer, Support, Superviseur). Each type extends to a dedicated model:
- `User` → `Client`, `Freelancer`, `Support`, `Superviseur` (1:1 relations)
- User model defines role-checking methods: `isClient()`, `isFreelancer()`, `isSupport()`, `isSuperviseur()`
- During registration, `createUserProfile()` instantiates the appropriate role model
- Files: `backend/app/Models/User.php`, `backend/app/Http/Controllers/AuthController.php`

### 2. Frontend API Service Pattern
Authentication service centralizes all API calls via Axios interceptor:
- **Base URL**: `http://localhost:8000/api` (set in `frontend/src/services/authService.jsx`)
- **Token Storage**: `localStorage` keys: `auth_token`, `user`, `user_type`
- **Interceptor**: Automatically adds `Authorization: Bearer {token}` to all requests
- Routes use `proxy: "http://127.0.0.1:8000"` in `frontend/package.json` for local development
- Pattern: Service exports async functions (`loginUser`, `registerUser`, `logoutUser`), components catch/display errors

### 3. API Route Security
Routes in `backend/routes/api.php` use two middleware groups:
- **Public routes**: `/register`, `/login`, `/forgot-password`, `/reset-password` (no auth required)
- **Protected routes**: Wrapped in `Route::middleware('auth:sanctum')` (token required)
- Example: Password change, profile updates, status changes are protected

### 4. Database Transaction Patterns in Controllers
`AuthController` uses `DB::beginTransaction()` / `DB::commit()` / `DB::rollBack()` for multi-table operations:
- Register creates both `User` and role-specific profile (Client/Freelancer)
- File uploads stored in `public/photos_profil` via `store()` method
- All exceptions caught and wrapped in 500 responses with error messages

## Frontend Component Patterns

### Page Structure
Pages are organized by role in `frontend/src/pages/`:
- `/pages/client/`, `/pages/freelancer/`, `/pages/superviseur/`
- Auth pages (login, register, password reset) at root level
- Each role section has subfolders: `gestionUsers/`, `services/`, `commades/`

### State Management
- Local `useState` for form data and UI state (no Redux/Context in core flows)
- Context used in `pages/superviseur/superviseurContext.jsx` for shared state
- Standard pattern: `[formData, setFormData]`, `[isLoading, setIsLoading]`, `[message, setMessage]`

### Common Dependencies
- **Toast notifications**: `react-hot-toast` or `react-toastify`
- **Icons**: `react-feather`, `lucide-react` (Material Icons)
- **Charts**: `recharts`
- **UI Alerts**: `sweetalert2` + `sweetalert2-react-content`
- **PDF Export**: `jspdf`

## Development Workflow

### Backend Setup
```bash
cd backend
php artisan migrate          # Create tables from migrations
php artisan serve            # Start server on http://127.0.0.1:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start                    # Starts on http://localhost:3000, proxies API to :8000
```

### Git Workflow (from project guides)
1. **Fetch latest branches**: `git fetch origin && git branch -a`
2. **Work on feature branch**: `git checkout -b feature/your-task-name`
3. **Merge to main**: After testing, `git checkout main && git merge feature/name && git push -u origin main`
4. **Never work directly on `main`**

### Debugging Authentication Issues
- Check browser DevTools → Storage → LocalStorage for `auth_token` presence
- Verify CORS headers: `HandleCors` middleware enabled in `backend/app/Http/Kernel.php`
- Verify API base URL in `frontend/src/services/authService.jsx` matches running server
- API token format: `auth_token|{long-random-string}` (Sanctum format)

## File References

- **Backend routes**: `backend/routes/api.php` (API endpoints)
- **Authentication logic**: `backend/app/Http/Controllers/AuthController.php` (register, login, token refresh)
- **User models**: `backend/app/Models/User.php`, `Client.php`, `Freelancer.php`, `Support.php`, `Superviseur.php`
- **Frontend auth service**: `frontend/src/services/authService.jsx` (API client setup)
- **Frontend routing**: `frontend/src/App.jsx` (all routes and redirects)
- **Frontend config**: `frontend/package.json` (proxy, dependencies, Tailwind config)

## Key Conventions

1. **Error Handling**: Backend returns JSON with `success` boolean + `message` + `data` fields
2. **Validation**: Use Laravel's `$request->validate()` in controllers; frontend catches validation errors in axios `.catch()`
3. **File Uploads**: Store in public disk via `store('folder', 'public')`; paths returned in JSON response
4. **Timestamps**: Use `Carbon` for date handling; models auto-include `created_at`, `updated_at`
5. **Environment**: Backend requires `.env` with `DB_DATABASE=cleanix`, `MAIL_*` settings for password reset

## Testing & Verification

- **Frontend**: `npm test` (React Testing Library setup in place)
- **Backend**: PHPUnit tests in `backend/tests/` (test database seeding with `DatabaseSeeder.php`)
- **Manual API testing**: Use Postman/Insomnia with `http://127.0.0.1:8000/api` endpoints

## When Adding New Features

1. **Backend**: Create migration, model, controller method, register route in `api.php`
2. **Frontend**: Create service function in `authService.jsx` (or new service file), page/component, add route in `App.jsx`
3. **Multi-role feature**: Add role-specific routes and conditionally render components based on `user_type` stored in localStorage
4. **Database changes**: Always use migrations; test with `php artisan migrate:fresh --seed` for clean state
