-- ULTIMATE FIX V2 - Database Function untuk Bypass RLS
-- Jalankan di Supabase SQL Editor

-- =====================================================
-- Solusi: Database Function dengan SECURITY DEFINER
-- Function ini bypass RLS policy untuk mengatasi timing issue
-- =====================================================

-- Hapus policy lama
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_authenticated ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_with_fallback ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_anon_google ON public.profiles;

-- Hapus function lama jika ada
DROP FUNCTION IF EXISTS public.create_profile_for_user;

-- Buat policy sederhana untuk normal case
CREATE POLICY profiles_insert_authenticated ON public.profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- Database Function - Bypass RLS untuk Google OAuth
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'user'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Run dengan owner privileges, bypass RLS
SET search_path = public
AS $$
DECLARE
  v_profile json;
BEGIN
  -- Verify user exists in auth.users (security check)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User does not exist in auth.users';
  END IF;

  -- Check if profile already exists
  SELECT row_to_json(p.*) INTO v_profile
  FROM public.profiles p
  WHERE p.user_id = p_user_id;

  IF v_profile IS NOT NULL THEN
    -- Return existing profile
    RETURN v_profile;
  ELSE
    -- Insert new profile (this bypasses RLS)
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (p_user_id, p_email, p_full_name, p_role::role_type)
    RETURNING row_to_json(profiles.*) INTO v_profile;
    
    RETURN v_profile;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_profile_for_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_for_user TO anon;

-- =====================================================
-- Verifikasi Setup
-- =====================================================
-- Check policies
SELECT 
  'Policies' as type,
  policyname,
  cmd,
  with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'profiles' 
  AND cmd = 'INSERT'
ORDER BY policyname;

-- Check function
SELECT 
  'Function' as type,
  routine_name, 
  security_type,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'create_profile_for_user';

-- =====================================================
-- Test Function (Optional)
-- =====================================================
-- Uncomment to test with a real user_id from auth.users
-- SELECT public.create_profile_for_user(
--   'YOUR-USER-ID-HERE'::uuid,
--   'test@example.com',
--   'Test User',
--   'user'
-- );
