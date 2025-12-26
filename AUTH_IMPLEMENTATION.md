# Authentication Implementation Guide

## Overview
The LMS now has full authentication implemented with:
- ✅ Email/Password login via Supabase Auth
- ✅ Google OAuth integration
- ✅ Session management with AsyncStorage
- ✅ Auto-sync with profile database
- ✅ Row Level Security (RLS) support

## Files Created/Modified

### New Files
1. **`types/database.ts`** - TypeScript types matching your Supabase schema
2. **`services/authService.ts`** - Complete authentication service with:
   - `signInWithEmail()` - Email/password login
   - `signUpWithEmail()` - User registration
   - `signInWithGoogle()` - Google OAuth flow
   - `signOut()` - Logout
   - `getCurrentProfile()` - Get current user
   - `updateProfile()` - Update user data
   - `resetPassword()` - Password reset

### Modified Files
1. **`lib/supabase.ts`** - Enhanced with TypeScript types and AsyncStorage
2. **`components/Login.tsx`** - Real authentication UI with:
   - Email/password form
   - Google OAuth button
   - Loading states
   - Error handling
3. **`context/AppContext.tsx`** - Session management:
   - Auto-restore sessions on app start
   - Real-time auth state changes
   - Profile synchronization

## Environment Variables
Ensure your `.env` has:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Database Setup

### 1. Run the Schema
Execute `db/supabase_schema.sql` in your Supabase SQL Editor. This creates:
- `profiles` table (links to auth.users)
- All course/module/quiz tables
- Automatic profile creation trigger
- Row Level Security policies

### 2. Verify Tables
Check that these tables exist:
- `profiles`
- `courses`
- `modules`
- `quizzes`
- `questions`
- `answers`
- `enrollments`
- `module_progress`
- `certificates`
- `badges`

### 3. Configure Google OAuth in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Secret
4. Add authorized redirect URIs:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   ```

## Usage

### Sign Up New User
```typescript
import { signUpWithEmail } from '@/services/authService';

const result = await signUpWithEmail(
  'user@indosat.com',
  'password123',
  'John Doe',
  'EMP001'
);

if (result.success) {
  console.log('User created:', result.profile);
}
```

### Login with Email
```typescript
import { signInWithEmail } from '@/services/authService';

const result = await signInWithEmail(
  'user@indosat.com',
  'password123'
);

if (result.success) {
  console.log('Logged in:', result.profile);
}
```

### Login with Google
The Login component handles this automatically. When user clicks "Continue with Google":
1. Opens Google OAuth consent screen
2. User authorizes
3. App receives ID token
4. Calls `signInWithGoogle(idToken)`
5. Profile is created/fetched
6. User is redirected to dashboard

### Logout
```typescript
import { signOut } from '@/services/authService';

await signOut();
```

### Get Current User
```typescript
import { useApp } from '@/context/AppContext';

function MyComponent() {
  const { currentProfile, currentUser } = useApp();
  
  // currentProfile = raw database profile
  // currentUser = converted to legacy User type
  
  return <Text>{currentProfile?.full_name}</Text>;
}
```

## User Roles
The system supports 3 roles (defined in `profiles.role`):
- `admin` - Full system access
- `trainer` - Can create/manage courses
- `user` - Regular learner (DSE)

Roles are enforced by RLS policies in the database.

## Testing

### Create Test Users (SQL)
Run in Supabase SQL Editor:
```sql
-- Create test admin
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (
  'admin@indosat.com',
  crypt('password123', gen_salt('bf')),
  now()
);

-- Update profile role
UPDATE profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'admin@indosat.com';

-- Create test trainer
-- (repeat with trainer role)
```

### Manual Testing
1. Start app: `npx expo start`
2. Navigate to login screen
3. Try email login with test credentials
4. Try Google OAuth login
5. Verify session persists after app restart

## Security Notes

### RLS Policies
- Users can only read their own profile
- Admins can read all profiles
- Only authenticated users can read published courses
- Trainers can CRUD their own courses
- Users can enroll in published courses only

### Password Requirements
Supabase Auth enforces:
- Minimum 6 characters
- Email format validation
- Rate limiting on failed attempts

### Session Security
- Sessions stored in AsyncStorage (encrypted on device)
- Auto-refresh tokens
- 1 hour access token expiry (auto-renewed)

## Troubleshooting

### "relation public.profiles does not exist"
→ Run `db/supabase_schema.sql` in SQL Editor

### Google OAuth not working
→ Check:
1. Google Client ID in `.env`
2. Google provider enabled in Supabase
3. Redirect URI configured in Google Cloud Console

### Session not persisting
→ Verify AsyncStorage is installed:
```bash
npm install @react-native-async-storage/async-storage
```

### "User not found" after signup
→ Check that the trigger `handle_new_user` exists and is active

## Next Steps

1. **Email Verification** - Enable in Supabase Auth settings
2. **Password Reset** - UI for `resetPassword()` function
3. **Profile Edit** - Screen to update user details
4. **Social Logins** - Add Apple, Facebook providers
5. **2FA** - Enable MFA in Supabase for admins

## API Reference

See `services/authService.ts` for full API documentation.

## Support

For issues:
1. Check Supabase logs in Dashboard → Logs
2. Check RLS policies: Dashboard → Database → Policies
3. Verify auth configuration: Dashboard → Authentication
