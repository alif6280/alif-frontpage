import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Building2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Select, Alert, Card } from '../components/ui';
import { SEMESTERS, BATCHES, DEPARTMENTS } from '../data/courses';

export const ProfileSetupPage = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    student_id:      profile?.student_id      || '',
    university_name: profile?.university_name || 'Khwaja Yunus Ali University',
    department:      profile?.department      || 'Computer Science and Engineering',
    batch:           profile?.batch           || '1st Batch',
    semester:        profile?.semester        || '1st Year 1st Semester',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { setError('Student ID is required.'); return; }
    setLoading(true); setError('');
    const { error: err } = await updateProfile({ ...form, profile_complete: true });
    setLoading(false);
    if (err) { setError(typeof err === 'string' ? err : err.message); return; }
    toast.success('Profile saved! Welcome 🎉');
    navigate('/generator');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surf-2 dark:bg-dk-bg px-4 py-12">
      <div className="w-full max-w-[440px] animate-slide-up">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCheck size={24} className="text-brand-500" />
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Complete Your Profile</h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Hi {profile?.full_name?.split(' ')[0] || 'there'}! Just a few academic details and you're ready.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert type="error">{error}</Alert>}

            <Input
              label="Student ID"
              type="text"
              placeholder="e.g. 2201001"
              value={form.student_id}
              onChange={set('student_id')}
              icon={<Hash size={15} />}
            />

            <Input
              label="University Name"
              type="text"
              value={form.university_name}
              onChange={set('university_name')}
              icon={<Building2 size={15} />}
              hint="Change this if you're not from KYAU."
            />

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

            <Button type="submit" size="lg" variant="primary" className="w-full mt-2" loading={loading}>
              Save & Start Generating
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
