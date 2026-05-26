import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, fetchProfile, upsertProfile } from '../lib/supabase';

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u) => {
    if (!u) { setProfile(null); setLoading(false); return; }
    try {
      const { data } = await fetchProfile(u.id);
      if (data) {
        setProfile(data);
      } else {
        // Google OAuth – first time, create a skeleton profile
        const meta = u.user_metadata || {};
        const skeleton = {
          id:              u.id,
          email:           u.email,
          full_name:       meta.full_name || meta.name || '',
          avatar_url:      meta.avatar_url || meta.picture || '',
          university_name: 'Khwaja Yunus Ali University',
          role:            'student',
          profile_complete: false,
        };
        const { data: created } = await upsertProfile(skeleton);
        setProfile(created || skeleton);
      }
    } catch (e) {
      console.warn('Profile load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = () => user && loadProfile(user);

  const updateProfileCtx = async (updates) => {
    if (!user) return { error: 'Not logged in' };
    try {
      const { data, error } = await upsertProfile({ id: user.id, ...updates });
      if (data) setProfile(data);
      return { data, error };
    } catch (e) {
      return { error: e.message };
    }
  };

  return (
    <Ctx.Provider value={{ user, profile, loading, refreshProfile, updateProfile: updateProfileCtx }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
};
