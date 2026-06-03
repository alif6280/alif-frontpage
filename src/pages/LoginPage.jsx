import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, signInGoogle } from '../lib/supabase';
import { Button, Input, Divider, Alert } from '../components/ui';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
    <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/>
    <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" fill="#EA4335"/>
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [gLoading,   setGLoading]   = useState(false);
  const [error,      setError]      = useState('');

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        expiresIn: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      },
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    toast.success('Welcome back!');
    navigate('/generator');
  };

  const handleGoogle = async () => {
    setGLoading(true); setError('');
    const { error: err } = await signInGoogle();
    if (err) { setError(err.message); setGLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surf-2 dark:bg-dk-bg px-4 py-12">
      <div className="w-full max-w-[420px] animate-slide-up">
        <div className="bg-white dark:bg-dk-card rounded-3xl border border-surf-border dark:border-dk-border shadow-hover p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
              <BookOpen size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-400 dark:text-slate-400 mt-1.5">Sign in to your KYAU account</p>
          </div>

          {/* Google Button */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-center mb-5 border-surf-border dark:border-dk-border hover:bg-surf-3 dark:hover:bg-dk-card2 font-semibold dark:text-white"
            onClick={handleGoogle}
            loading={gLoading}
            icon={!gLoading && <GoogleIcon />}
          >
            Continue with Google
          </Button>

          <Divider label="or sign in with email" />

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-4">
            {error && <Alert type="error">{error}</Alert>}

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors z-10"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-500 cursor-pointer"
                />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-500 dark:text-brand-300 hover:text-brand-600 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" variant="primary" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 dark:text-brand-300 font-semibold hover:text-brand-600">
              Create one free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};
