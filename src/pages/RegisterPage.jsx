import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Hash, BookOpen, Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { signUpEmail, verifyOtp, signInGoogle, upsertProfile } from '../lib/supabase';
import { Button, Input, Select, Divider, Alert } from '../components/ui';
import { SEMESTERS, BATCHES, DEPARTMENTS } from '../data/courses';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
    <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"/>
    <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" fill="#EA4335"/>
  </svg>
);

const STEPS = ['Account', 'Academic', 'Verify'];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=account, 1=academic, 2=otp
  const [gLoading, setGLoading] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [otp,      setOtp]      = useState('');

  const [form, setForm] = useState({
    full_name: '', student_id: '', email: '', password: '',
    university_name: 'Khwaja Yunus Ali University',
    department: 'Computer Science and Engineering',
    batch: '1st Batch', semester: '1st Year 1st Semester',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  /* ── Google OAuth ─────────────────────────────────────────────── */
  const handleGoogle = async () => {
    setGLoading(true); setError('');
    const { error: err } = await signInGoogle();
    if (err) { setError(err.message); setGLoading(false); }
    // Redirects to /auth/callback on success
  };

  /* ── Step 0 → 1 (validate account fields) ────────────────────── */
  const handleStep0 = (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { setError('Please fill all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setStep(1);
  };

  /* ── Step 1 → submit register (sends OTP) ─────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { setError('Student ID is required.'); return; }
    setLoading(true); setError('');
    const { error: err } = await signUpEmail(form.email, form.password, {
      full_name:       form.full_name,
      student_id:      form.student_id,
      university_name: form.university_name,
      department:      form.department,
      batch:           form.batch,
      semester:        form.semester,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep(2);
  };

  /* ── Step 2 — verify OTP ─────────────────────────────────────── */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true); setError('');
    const { data, error: err } = await verifyOtp(form.email, otp);
    if (err) { setError(err.message); setLoading(false); return; }
    // Create profile row
    if (data?.user) {
      await upsertProfile({
        id:              data.user.id,
        email:           form.email,
        full_name:       form.full_name,
        student_id:      form.student_id,
        university_name: form.university_name,
        department:      form.department,
        batch:           form.batch,
        semester:        form.semester,
        role:            'student',
        profile_complete: true,
      });
    }
    setLoading(false);
    toast.success('Account verified! Welcome 🎉');
    navigate('/generator');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surf-2 dark:bg-dk-bg px-4 py-12">
      <div className="w-full max-w-[460px] animate-slide-up">
        <div className="bg-white dark:bg-dk-card rounded-3xl border border-surf-border dark:border-dk-border shadow-hover overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-surf-border dark:border-dk-border">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
              <BookOpen size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Create your account</h1>
            <p className="text-sm text-gray-400 mt-1.5">Register once, auto-fill forever</p>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${i === step ? 'bg-brand-500 text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-surf-2 dark:bg-dk-card2 text-gray-400 dark:text-dk-muted'}`}>
                    {i < step ? '✓' : i + 1} {s}
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-6 h-0.5 rounded ${i < step ? 'bg-brand-500' : 'bg-surf-border dark:bg-dk-border'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            {/* ── STEP 0 — Account ─────────────────────────────── */}
            {step === 0 && (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center mb-5 border-surf-border dark:border-dk-border hover:bg-surf-3 dark:hover:bg-dk-card2 font-semibold"
                  onClick={handleGoogle}
                  loading={gLoading}
                  icon={!gLoading && <GoogleIcon />}
                >
                  Continue with Google
                </Button>
                <p className="text-xs text-gray-400 text-center mb-1">
                  Google sign-in will prompt you to complete your academic profile after login.
                </p>
                <Divider label="or register with email" />

                <form onSubmit={handleStep0} className="space-y-4">
                  {error && <Alert type="error">{error}</Alert>}
                  <Input label="Full Name" type="text" placeholder="Md. Student Name" value={form.full_name} onChange={set('full_name')} icon={<User size={15} />} autoComplete="name" />
                  <Input label="Email Address" type="email" placeholder="student@kyau.ac.bd" value={form.email} onChange={set('email')} icon={<Mail size={15} />} autoComplete="email" />
                  <Input
                    label="Password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={form.password} onChange={set('password')} icon={<Lock size={15} />}
                    suffix={<button type="button" onClick={() => setShowPw(s => !s)} className="hover:text-brand-500">{showPw ? <EyeOff size={14}/> : <Eye size={14}/>}</button>}
                    autoComplete="new-password"
                  />
                  <Button type="submit" size="lg" variant="primary" className="w-full">Next: Academic Info →</Button>
                </form>
              </>
            )}

            {/* ── STEP 1 — Academic ────────────────────────────── */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert type="error">{error}</Alert>}
                <Input label="Student ID" type="text" placeholder="e.g. 2201001" value={form.student_id} onChange={set('student_id')} icon={<Hash size={15} />} />
                <Input label="University Name" type="text" value={form.university_name} onChange={set('university_name')} icon={<Building2 size={15} />} hint="Default is KYAU — change if you're from another university." />
                <Select label="Department" value={form.department} onChange={set('department')}>
                  {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  <option value="Other">Other</option>
                </Select>
                <Select label="Batch" value={form.batch} onChange={set('batch')}>
                  {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Current Semester" value={form.semester} onChange={set('semester')}>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => { setStep(0); setError(''); }}>← Back</Button>
                  <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading}>Create Account →</Button>
                </div>
              </form>
            )}

            {/* ── STEP 2 — Verify OTP ──────────────────────────── */}
            {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="text-center py-2">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail size={22} className="text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-dk-text">Check your email</p>
                  <p className="text-sm text-gray-400 mt-1">We sent a 6-digit code to <strong className="text-gray-600 dark:text-dk-text">{form.email}</strong></p>
                </div>

                {error && <Alert type="error">{error}</Alert>}

                <Input
                  label="Verification Code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl font-mono tracking-[0.4em] py-4"
                />
                <Button type="submit" size="lg" variant="primary" className="w-full" loading={loading}>Verify & Continue</Button>
                <Button type="button" variant="ghost" size="md" className="w-full" onClick={() => setStep(1)}>← Back</Button>
              </form>
            )}

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
