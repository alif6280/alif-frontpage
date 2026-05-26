import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { sendPasswordReset } from '../lib/supabase';
import { Button, Input, Alert, Card } from '../components/ui';

export const ForgotPasswordPage = () => {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true); setError('');
    const { error: err } = await sendPasswordReset(email);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surf-2 dark:bg-dk-bg px-4 py-12">
      <div className="w-full max-w-[400px] animate-slide-up">
        <Card className="p-8">
          <div className="text-center mb-7">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={20} className="text-blue-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Forgot Password?</h1>
            <p className="text-sm text-gray-400 mt-1.5">Enter your email and we'll send a reset link.</p>
          </div>

          {sent ? (
            <Alert type="success">
              Reset link sent to <strong>{email}</strong>. Check your inbox and spam folder.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert type="error">{error}</Alert>}
              <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={15} />} autoComplete="email" />
              <Button type="submit" size="lg" variant="primary" className="w-full" loading={loading}>Send Reset Link</Button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-1.5 mt-5 text-sm text-brand-500 font-semibold hover:text-brand-600">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </Card>
      </div>
    </div>
  );
};
