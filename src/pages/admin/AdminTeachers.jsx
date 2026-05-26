import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetchAllTeachers, adminUpsertTeacher, adminDeleteTeacher } from '../../lib/supabase';
import { Button, Input, Card, Badge, Spinner, Alert } from '../../components/ui';

const EMPTY = { name:'', designation:'', email:'' };

export const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await adminFetchAllTeachers();
      if (err) throw err;
      setTeachers(data || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing.name) { setError('Name is required.'); return; }
    setSaving(true); setError('');
    try {
      const { error: err } = await adminUpsertTeacher(editing);
      if (err) throw err;
      toast.success(editing.id ? 'Teacher updated!' : 'Teacher added!');
      setEditing(null); load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await adminDeleteTeacher(id);
      setTeachers(t => t.filter(x => x.id !== id));
      toast.success('Teacher deleted.');
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Teachers</h1>
            <p className="text-sm text-gray-400 mt-1">{teachers.length} teachers in database</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={15}/>} onClick={() => setEditing({ ...EMPTY })}>
            Add Teacher
          </Button>
        </div>

        {editing && (
          <Card className="mb-6 p-6 border-brand-200 dark:border-brand-500/30">
            <h3 className="font-bold text-sm text-gray-700 dark:text-dk-text mb-4">{editing.id ? 'Edit Teacher' : 'New Teacher'}</h3>
            {error && <Alert type="error" className="mb-4">{error}</Alert>}
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Full Name" value={editing.name} onChange={e => setEditing(f => ({...f, name: e.target.value}))} />
              <Input label="Designation" value={editing.designation} onChange={e => setEditing(f => ({...f, designation: e.target.value}))} placeholder="e.g. Lecturer on Probation" />
              <Input label="Email (optional)" type="email" value={editing.email || ''} onChange={e => setEditing(f => ({...f, email: e.target.value}))} />
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="primary" size="sm" icon={<Check size={14}/>} onClick={handleSave} loading={saving}>Save</Button>
              <Button variant="secondary" size="sm" icon={<X size={14}/>} onClick={() => { setEditing(null); setError(''); }}>Cancel</Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2">
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide hidden md:table-cell">Designation</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide hidden lg:table-cell">Email</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surf-border dark:divide-dk-border">
                  {teachers.map(t => (
                    <tr key={t.id} className="hover:bg-surf-2 dark:hover:bg-dk-card2 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-dk-text">{t.name}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <Badge variant="default">{t.designation || '—'}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">{t.email || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="xs" icon={<Pencil size={12}/>} onClick={() => setEditing({ ...t })} />
                          <Button variant="danger" size="xs" icon={<Trash2 size={12}/>} loading={deleting === t.id} onClick={() => handleDelete(t.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {teachers.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No teachers found.</div>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
