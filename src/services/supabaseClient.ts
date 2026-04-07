import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CRITICAL: Use publishable key in the frontend. 
// Admin/Secret keys should NEVER be exposed here.
const SUPABASE_URL = 'https://kufutybogziiiynmmjcm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PLnezkmSECzEwl_JsZOiQg_Jz81Pbdz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Set to false for React Native
  },
});

/**
 * BACKEND UTILITY PLACEHOLDER
 * If you ever need to perform admin operations (like deleting users or 
 * bypassing RLS for system tasks), you would use the service_role/admin key.
 * DO NOT use the admin key in this file for production frontend code.
 * 
 * Example of how to plug in secret-key logic for Edge Functions or a Secure Server:
 * const adminClient = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 */
