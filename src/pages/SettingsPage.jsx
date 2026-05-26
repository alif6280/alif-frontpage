import React, { useState } from 'react';
import { User, Lock, Mail, Hash, Building2, BookOpen, Camera, Shield, Palette, Bell, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { supabase, sendPasswordReset } from '../lib/supabase';
import { Button, Input, Select, Card, Alert, Toggle } from '../components/ui';
import { SEMESTERS, BATCHES, DEPARTMENTS } from '../data/courses';

const Section = ({ icon: Icon, title, children }) => (
  <Card className="overflow-hidden">
    <div className="px-6 py-4 border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2 flex items-center gap-2.5">
      <Icon size={16} className="text-brand-500" />
      <h2 className="font-bold text-sm text-gray-700 dark:text-dk-text">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </Card>
);

export const SettingsPage = () => {
  const { profile, user, updateProfile } = useAuth();
  const { dark, toggleDark }             = useTheme();
  const [saving,  setSaving]  = useState(false);
  const [pwSent,  setPwSent]  = useState(false);
  const [delConf, setDelConf] = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    full_name:       profile?.full_name       || '',
    student_id:      profile?.student_id      || '',
    university_name: profile?.university_name || 'Khwaja Yunus Ali University',
    department:      profile?.department      || 'Computer Science and Engineering',
    batch:           profile?.batch           || '1st Batch',
    semester:        profile?.semester        || '1st Year 1st Semester',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError('');
    const { error: err } = await updateProfile(form);
    setSaving(false);
    if (err) { setError(typeof err === 'string' ? err : err.message); return; }
    toast.success('Profile updated!');
  };

  const handlePasswordReset = async () => {
    const { error: err } = await sendPasswordReset(user.email);
    if (err) { toast.error(err.message); return; }
    setPwSent(true);
    toast.success('Password reset email sent!');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext  = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) { toast.error('Upload failed: ' + upErr.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    await updateProfile({ avatar_url: publicUrl });
    toast.success('Profile photo updated!');
  };

  const handleDeleteAccount = async () => {
    // In production, you'd call a Supabase Edge Function that deletes the user
    toast.error('Account deletion requires admin confirmation. Contact support.');
    setDelConf(false);
  };

  const avatar = profile?.avatar_url;
  const initials = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your profile, account, and app preferences.</p>
        </div>

        {/* ── Profile Photo ───────────────────────────────────── */}
        <Section icon={Camera} title="Profile Photo">
          <div className="flex items-center gap-5">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-surf-border dark:border-dk-border" />
              : <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-card">{initials}</div>
            }
            <div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-surf-2 dark:bg-dk-card2 border border-surf-border dark:border-dk-border text-sm font-semibold text-gray-600 dark:text-dk-text rounded-xl hover:bg-surf-3 transition-all">
                  <Camera size={14} /> Upload Photo
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · Max 2 MB</p>
            </div>
          </div>
        </Section>

        {/* ── Personal Info ────────────────────────────────────── */}
        <Section icon={User} title="Personal Information">
          {error && <Alert type="error">{error}</Alert>}
          <Input label="Full Name" value={form.full_name} onChange={set('full_name')} icon={<User size={15} />} />
          <Input label="Student ID" value={form.student_id} onChange={set('student_id')} icon={<Hash size={15} />} />
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Email Address</label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surf-2 dark:bg-dk-card2 border border-surf-border dark:border-dk-border text-sm text-gray-500 dark:text-dk-muted">
              <Mail size={14} className="text-gray-300" />
              {user?.email}
              <span className="ml-auto text-xs text-green-500 font-medium">Verified</span>
            </div>
          </div>
        </Section>

        {/* ── Academic Info ────────────────────────────────────── */}
        <Section icon={BookOpen} title="Academic Information">
          <Input label="University Name" value={form.university_name} onChange={set('university_name')} icon={<Building2 size={15} />} hint="This auto-fills the University Name on your front page." />
          <Select label="Department" value={form.department} onChange={set('department')}>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            <option value="Other">Other</option>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Batch" value={form.batch} onChange={set('batch')}>
              {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select label="Current Semester" value={form.semester} onChange={set('semester')}>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="w-full">
            Save Changes
          </Button>
        </Section>

        {/* ── App Preferences ──────────────────────────────────── */}
        <Section icon={Palette} title="App Preferences">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-dk-text">Dark Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Applies to entire app UI. Front page preview always stays white.</p>
            </div>
            <Toggle checked={dark} onChange={toggleDark} />
          </div>
        </Section>

        {/* ── Security ─────────────────────────────────────────── */}
        <Section icon={Lock} title="Security">
          {pwSent
            ? <Alert type="success">Password reset email sent to <strong>{user?.email}</strong>. Check your inbox.</Alert>
            : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-dk-text">Change Password</p>
                  <p className="text-xs text-gray-400 mt-0.5">We'll email you a secure reset link.</p>
                </div>
                <Button variant="secondary" size="sm" icon={<Lock size={13} />} onClick={handlePasswordReset}>
                  Reset Password
                </Button>
              </div>
            )
          }
        </Section>

        {/* ── Danger Zone ──────────────────────────────────────── */}
        <Section icon={Shield} title="Danger Zone">
          {delConf ? (
            <div className="space-y-3">
              <Alert type="error">This will permanently delete your account and all generated history. This action cannot be undone.</Alert>
              <div className="flex gap-3">
                <Button variant="danger" size="sm" icon={<Trash2 size={13}/>} onClick={handleDeleteAccount}>Confirm Delete</Button>
                <Button variant="secondary" size="sm" onClick={() => setDelConf(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-dk-text">Delete Account</p>
                <p className="text-xs text-gray-400 mt-0.5">Permanently remove all your data.</p>
              </div>
              <Button variant="danger" size="sm" icon={<Trash2 size={13}/>} onClick={() => setDelConf(true)}>
                Delete Account
              </Button>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
};
