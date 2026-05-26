import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, fetchProfile } from '../lib/supabase';
import { PageLoader } from '../components/ui';

/**
 * Supabase redirects here after Google OAuth.
 * We check if the profile is complete; if not → ProfileSetup.
 */
export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handle = async () => {
      // Supabase auto-handles the hash params; just wait for session
      const { data: { session }, error: sessErr } = await supabase.auth.getSession();
      if (sessErr || !session) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Check profile completeness
      try {
        const { data: profile } = await fetchProfile(session.user.id);
        if (profile && profile.profile_complete) {
          navigate('/generator', { replace: true });
        } else {
          // Needs to fill in student_id, batch, semester etc.
          navigate('/profile-setup', { replace: true });
        }
      } catch {
        // Profile table not set up yet — send to setup
        navigate('/profile-setup', { replace: true });
      }
    };

    handle();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surf-2 dark:bg-dk-bg">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return <PageLoader />;
};
