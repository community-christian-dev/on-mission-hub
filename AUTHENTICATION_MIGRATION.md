# Authentication System Migration Guide

## Overview

The app has been migrated from **device-based lazy authentication** (anonymous Firebase login) to **proper email/password authentication** with persistent sessions across multiple devices.

## What Changed

### 1. Authentication Method

- **Before**: Anonymous authentication (each device got a unique anonymous user ID)
- **After**: Email/password authentication with persistent sessions

### 2. Key Features of New System

✅ **Multi-device support** - Users log in once and access their data from any device
✅ **No auto-logout** - Sessions persist using Firebase's browser local persistence
✅ **Simple login flow** - Clean sign up / sign in interface
✅ **User data namespace** - Data is stored per authenticated user (same as before, structure unchanged)
✅ **Session across page reloads** - Browser automatically restores session

## Components Modified

### `app/providers/AuthProvider.tsx`

**Changes:**

- Replaced anonymous login with email/password authentication
- Added `signUp(email, password, displayName)` function
- Added `signIn(email, password)` function
- Added `signOut()` function
- Added error handling and error state management
- Enabled Firebase's `browserLocalPersistence` for persistent sessions
- Creates user profile document in Firestore on signup

**New Context Properties:**

```typescript
{
  user: User | null,           // Current authenticated user
  loading: boolean,            // Auth state loading
  signUp: Function,            // Create new account
  signIn: Function,            // Log in to existing account
  signOut: Function,           // Sign out
  error: string | null,        // Auth error messages
  clearError: Function,        // Clear error state
}
```

### `app/components/LoginPage.tsx` (NEW)

**Features:**

- Simple toggle between "Sign In" and "Sign Up" modes
- Email and password validation
- Display name field for new accounts
- Error messages from authentication
- Responsive design with Tailwind CSS
- Visual feedback during authentication (loading state)
- Help text explaining multi-device support

### `app/components/Header.tsx`

**Changes:**

- Added user menu dropdown showing email address
- Added "Sign Out" button in dropdown
- Shows user's email prefix as username
- Loading state while signing out
- Menu toggles with button click, closes on sign out

### `app/page.tsx` (Main Home Page)

**Changes:**

- Imports `LoginPage` component
- Imports `useAuth` hook
- Checks `user` property from auth context
- Shows `LoginPage` if `!user`, main app if authenticated

## Data Storage & Persistence

### Firestore Structure

Data is stored in the same hierarchical structure as before:

```
firestore/
└── users/
    └── {userId}/
        ├── orbitItems/
        │   └── {itemId}
        ├── readings/
        │   └── {readingId}
        ├── monthlyActions/
        │   └── {actionId}
        └── userProfile
            ├── email
            ├── displayName
            ├── createdAt
            └── lastLogin
```

### Session Persistence

Firebase's `browserLocalPersistence` automatically:

- Stores auth tokens in browser's localStorage
- Restores user session on page reload
- Maintains session across browser sessions
- Syncs data across tabs/windows

## User Experience Flow

### First-Time User

1. User visits app → sees LoginPage
2. Clicks "Sign Up"
3. Enters name, email, password (6+ chars)
4. Account created → auto-logged in → app loads

### Returning User (Same Device)

1. User visits app → automatically logged in (session restored)
2. Sees main interface immediately

### Returning User (Different Device)

1. User visits app → sees LoginPage
2. Enters email and password
3. Logs in → data synced from Firestore
4. Sees their existing items, readings, etc.

## Migration Notes for Developers

### Breaking Changes

1. **No more anonymous users** - All routes that check `useAuth()` now require `user` to be non-null
2. **User ID structure** - User IDs change if you move data from the old system (Firebase anonymous IDs are different from authenticated user IDs)
3. **Auth state changes** - `useAuth()` context now has more properties (`signUp`, `signIn`, `signOut`, `error`, `clearError`)

### Data Migration (If Needed)

If you want to preserve data from the old anonymous login system:

1. Export data from old anonymous user IDs
2. Create script to reassign data to new authenticated user IDs
3. This would need to be done before switching systems in production

### Adding Protected Routes

```tsx
import { useAuth } from "@/app/providers/AuthProvider";

function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;

  return <YourComponent />;
}
```

### Error Handling Pattern

```tsx
const { user, error, clearError, signIn } = useAuth();

const handleLogin = async () => {
  try {
    await signIn(email, password);
    // Success - user is automatically set in context
  } catch (err) {
    // Error is in context.error
    // Call clearError() when needed
  }
};
```

## Security Considerations

✓ **Passwords** are handled by Firebase (SSL/TLS encrypted, never stored as plain text)
✓ **Email verification** can be added if needed
✓ **Password reset** functionality available (not yet implemented in UI)
✓ **Session tokens** auto-refresh when expired
✓ **Cross-device sync** maintains security with Firebase's auth tokens

## Testing the New System

### Test Multi-Device Support

1. Create account on Device A
2. Add some items to orbit
3. Log in on Device B with same email/password
4. Verify items are visible on Device B
5. Add item on Device B
6. Refresh Device A - verify new item appears

### Test Session Persistence

1. Log in on a device
2. Close browser tab/window
3. Reopen app - should be automatically logged in
4. Refresh page - should remain logged in

### Test SignOut

1. Sign out from user menu
2. Should redirect to LoginPage
3. Logging back in should work normally

## Configuration Notes

### Firebase Requirements

- Email/Password authentication provider must be enabled in Firebase Console
- Firestore rules should allow reads/writes to `/users/{uid}/**` for authenticated users

### Environment Variables

No new environment variables are required - uses existing Firebase config:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Future Enhancements

Potential features to add later:

- Email verification on signup
- Password reset flow ("Forgot password?")
- Social authentication (Google, Apple One-Click)
- Profile settings page (change display name, email, password)
- Session management (view active sessions, sign out from other devices)
- Account deletion
- Two-factor authentication (2FA)

## Rollback Plan

If you need to revert to anonymous authentication:

1. Restore old `AuthProvider.tsx` from git history
2. Change `page.tsx` to remove LoginPage check
3. Clear any new Firestore user documents created
4. Reset deployed version

## Questions & Troubleshooting

### User can't see their old data

- Old data is associated with anonymous user IDs
- Would need data migration script to transfer to new authenticated users
- For now, treat as fresh start in production

### Session not persisting

- Check browser's localStorage is enabled
- Verify Firebase config is correct
- Check browser's privacy/security settings

### Email validation errors

- Firebase has specific error messages (check console)
- Common: email already exists, invalid email format, weak password
- Errors are displayed in LoginPage

---

**Summary**: Users now have persistent, multi-device accounts with simple email/password login. Data syncs automatically via Firestore. No more anonymous sessions!
