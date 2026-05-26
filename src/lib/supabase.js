import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.REACT_APP_SUPABASE_URL     || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
  },
});

/* ─── Auth helpers ─── */

/** Email + password sign-up (triggers OTP email) */
export const signUpEmail = (email, password, meta) =>
  supabase.auth.signUp({ email, password, options: { data: meta } });

/** Verify OTP after sign-up */
export const verifyOtp = (email, token) =>
  supabase.auth.verifyOtp({ email, token, type: 'signup' });

/** Email + password sign-in */
export const signInEmail = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

/**
 * Google OAuth sign-in.
 * redirectTo must match what you add in Supabase Dashboard →
 * Authentication → URL Configuration → Redirect URLs.
 */
export const signInGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });

/** Sign out current session */
export const signOut = () => supabase.auth.signOut();

/** Send password-reset email */
export const sendPasswordReset = (email) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

/** Update password (from reset link) */
export const updatePassword = (newPassword) =>
  supabase.auth.updateUser({ password: newPassword });

/* ─── Profile helpers ─── */

export const fetchProfile = (userId) =>
  supabase.from('users').select('*').eq('id', userId).single();

export const upsertProfile = (profile) =>
  supabase.from('users').upsert(profile).select().single();

export const updateProfile = (userId, updates) =>
  supabase.from('users').update(updates).eq('id', userId).select().single();

/* ─── Course helpers ─── */

export const fetchDepartments = () =>
  supabase.from('departments').select('*').order('name');

export const fetchCoursesBySemester = (departmentId, semester) =>
  supabase
    .from('courses')
    .select('*, teacher:teachers(*)')
    .eq('department_id', departmentId)
    .eq('semester', semester)
    .eq('is_active', true);

export const searchCourses = (query) =>
  supabase
    .from('courses')
    .select('*, teacher:teachers(*)')
    .or(`course_code.ilike.%${query}%,course_title.ilike.%${query}%`)
    .eq('is_active', true)
    .limit(20);

/* ─── History helpers ─── */

export const saveHistory = (entry) =>
  supabase.from('history').insert(entry).select().single();

export const fetchHistory = (userId) =>
  supabase
    .from('history')
    .select('*, course:courses(course_code,course_title), template:templates(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

export const deleteHistoryEntry = (id) =>
  supabase.from('history').delete().eq('id', id);

/* ─── Admin helpers ─── */

export const adminFetchAllUsers = () =>
  supabase.from('users').select('*').order('created_at', { ascending: false });

export const adminFetchAllCourses = () =>
  supabase.from('courses').select('*, teacher:teachers(*), department:departments(*)').order('course_code');

export const adminUpsertCourse = (course) =>
  supabase.from('courses').upsert(course).select().single();

export const adminDeleteCourse = (id) =>
  supabase.from('courses').delete().eq('id', id);

export const adminFetchAllTeachers = () =>
  supabase.from('teachers').select('*, department:departments(name)').order('name');

export const adminUpsertTeacher = (t) =>
  supabase.from('teachers').upsert(t).select().single();

export const adminDeleteTeacher = (id) =>
  supabase.from('teachers').delete().eq('id', id);

export const adminFetchTemplates = () =>
  supabase.from('templates').select('*').order('name');

export const adminToggleTemplate = (id, is_active) =>
  supabase.from('templates').update({ is_active }).eq('id', id);
