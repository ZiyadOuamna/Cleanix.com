# 🧪 Testing Guide - Security Features

## Setup for Testing

### Terminal 1 - Start Backend
```bash
cd backend
php artisan serve
# Server runs on http://127.0.0.1:8000
```

### Terminal 2 - Start Frontend  
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### Terminal 3 - Database (if needed)
```bash
# For fresh testing
cd backend
php artisan migrate:fresh --seed
# This creates test users and data
```

---

## Test Case 1: Back Button Prevention ✅

### What Should Happen
After login, clicking back button should NOT show login page.

### Steps
1. Open http://localhost:3000/login
2. Enter test credentials:
   - Email: `test@example.com` (or any registered client)
   - Password: (correct password)
3. Click "Se connecter" button
4. You should see dashboard with user's bookings
5. **Click browser back button ⬅️**

### Expected Result
- ❌ Should NOT show login form
- ✅ Should stay on dashboard OR redirect back to dashboard
- ✅ URL might change but page should redirect

### If It Fails
Check:
```javascript
// Open Console (F12)
localStorage.getItem('auth_token')
// Should show: "auth_token|xxxxx" (not null or empty)

localStorage.getItem('user_type')
// Should show: "Client" (your login type)
```

---

## Test Case 2: Can't Access Login While Logged In ❌

### What Should Happen
Typing login URL directly should redirect to dashboard.

### Steps
1. While logged in (from Test Case 1)
2. Type in address bar: `http://localhost:3000/login`
3. Press Enter

### Expected Result
- ❌ Should NOT show login form
- ✅ Should automatically redirect to `/client/dashboard`
- ✅ You should see YOUR dashboard content

---

## Test Case 3: Logout Clears Everything ✅

### What Should Happen
After logout, user cannot access dashboard.

### Steps
1. While logged in
2. Look for logout button (usually in user menu or header)
3. Click "Se déconnecter" (Logout)
4. You should see login page

### Verify Complete Logout
```javascript
// Open Console (F12)
localStorage.getItem('auth_token')
// Should show: null (not the token)

localStorage.getItem('user_type')
// Should show: null

localStorage.getItem('user')
// Should show: null
```

### Try to Go Back to Dashboard
1. After logout (you're on login page)
2. Click browser back button ⬅️

### Expected Result
- ❌ Should NOT show dashboard
- ✅ Should stay on login page OR show login again

---

## Test Case 4: Wrong Dashboard Type Redirect ✅

### What Should Happen
User can only see their role's dashboard.

### Steps
1. Log in as **Client**
2. You should see `/client/dashboard`
3. Type in address bar: `http://localhost:3000/freelancer/dashboard`
4. Press Enter

### Expected Result
- ❌ Should NOT show freelancer dashboard
- ✅ Should redirect back to `/client/dashboard`

### Test Opposite
If you have a freelancer account:
1. Log in as **Freelancer**
2. Type: `http://localhost:3000/client/dashboard`
3. Should redirect to `/freelancer/dashboard`

---

## Test Case 5: Token Expiry Detection ✅

### What Should Happen
App detects invalid/expired token and forces re-login.

### Steps
1. Log in as normal
2. You're on dashboard
3. Open DevTools (F12) → Application → LocalStorage
4. Find "auth_token" entry
5. Delete it (click the row, press Delete)
6. Refresh page (F5 or Ctrl+R)

### Expected Result
- ❌ Should NOT show dashboard
- ✅ Should redirect to login page
- ✅ Should show loading spinner briefly
- ✅ Message might appear: "Token invalid"

---

## Test Case 6: Multiple Logins Prevention ✅

### What Should Happen
Can't log in two accounts simultaneously (at least in browser).

### Steps
1. **Browser Window 1**: Log in as Client (email1@test.com)
2. You see Client dashboard
3. **Open New Tab or Private Window**
4. Go to http://localhost:3000/login
5. Log in as Freelancer (freelancer@test.com)
6. You see Freelancer dashboard
7. **Go back to Tab 1 with Client account**

### Expected Result
- Window 1: Might show loading/redirect
- Might need to refresh
- Should show Freelancer account (last login wins)
- This is expected behavior

### Note
True multi-session requires backend session management. The frontend prevents access to wrong dashboard type.

---

## Test Case 7: New Tab Same Token ✅

### What Should Happen
Token works across tabs/windows for same session.

### Steps
1. Log in in Tab 1
2. **Open new Tab 2**
3. Type: http://localhost:3000/client/dashboard
4. DON'T log in, just go to URL

### Expected Result
- ✅ Should show dashboard (uses same auth_token from Tab 1)
- ✅ No login required

### Why
Token stored in localStorage, shared across same origin

---

## Test Case 8: Loading State ⏳

### What Should Happen
See brief loading spinner while validating token.

### Steps
1. Log in (token stored)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Expected Result
- ✅ Should see loading spinner briefly
- ✅ Then dashboard loads
- This is `isLoading` state from App.jsx

---

## Automated Testing (Optional)

### Browser Console Test Script
```javascript
// Copy-paste in Console (F12) while logged in
async function testSecurity() {
  console.log('🔐 Starting Security Tests...\n');
  
  // Test 1: Token exists
  const token = localStorage.getItem('auth_token');
  console.log(`✅ Token exists: ${token ? 'YES' : 'NO'}`);
  
  // Test 2: User type exists
  const userType = localStorage.getItem('user_type');
  console.log(`✅ User type: ${userType}`);
  
  // Test 3: User data exists
  const user = localStorage.getItem('user');
  console.log(`✅ User data exists: ${user ? 'YES' : 'NO'}`);
  
  // Test 4: Can fetch user from API
  try {
    const response = await fetch('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    console.log(`✅ API validation: ${response.ok ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    console.log(`❌ API validation: ERROR - ${e.message}`);
  }
  
  console.log('\n🔐 Security Tests Complete');
}

testSecurity();
```

---

## Debugging Tips

### Issue: "Can't validate token"
```javascript
// Check token format
const token = localStorage.getItem('auth_token');
console.log(token);
// Should look like: "auth_token|xxxxxxxxxxx"
// NOT: "Bearer auth_token|xxxxx"
```

### Issue: "Still seeing login after logout"
```javascript
// Clear everything
localStorage.clear();
sessionStorage.clear();
// Then refresh
location.reload();
```

### Issue: "Redirects looping"
```javascript
// Check browser console for errors
// Check backend server is running
// Check API endpoints in Network tab (F12)
```

### Network Tab Testing (F12)
1. Open DevTools → Network tab
2. Keep it open
3. Log in
4. Watch for requests:
   - `POST /api/login` → Should return token
   - `GET /api/user` → Should return user data

5. After logout:
   - `POST /api/logout` → Should invalidate token
   - Any subsequent `/api/user` → Should return 401

---

## Success Checklist ✅

- [ ] Back button doesn't show login after logout
- [ ] Can't visit /login while logged in
- [ ] Logout completely clears localStorage
- [ ] Wrong dashboard type redirects to correct one
- [ ] Deleted token shows redirect to login
- [ ] Multiple login attempts work (last one wins)
- [ ] New tabs share same session
- [ ] Loading spinner appears on hard refresh
- [ ] All API calls include Bearer token
- [ ] No console errors

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Token not found in storage" | Login failed | Try login again, check backend |
| "Endless redirect loop" | Route protection conflict | Check PublicRoute/ProtectedRoute |
| "Token validated but still redirects" | Token invalid on backend | Check backend /api/user endpoint |
| "Different account in another tab" | Expected behavior | Close other tabs or log out |
| "Login page shown during load" | isLoading not working | Check App.jsx useEffect |

---

## Performance Notes

**Expected Performance**:
- Token validation: ~100-300ms (API call to backend)
- Route protection check: <1ms (localStorage read)
- Login: ~1-2 seconds (network dependent)
- Logout: ~500-1000ms (network + cleanup)

**If too slow**:
1. Check backend response time
2. Check network latency
3. Check browser dev tools Network tab
4. Consider implementing token refresh (optional)

---

**Last Updated**: December 8, 2025  
**Status**: Ready for Testing ✅
