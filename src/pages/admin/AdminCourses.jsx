import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetchAllCourses, adminUpsertCourse, adminDeleteCourse } from '../../lib/supabase';
import { Button, Input, Select, Card, Badge, Spinner, Alert } from '../../components/ui';
import { SEMESTERS } from '../../data/courses';

const EMPTY = { course_code:'', course_title:'', course_type:'Theory', semester:'1st Year 1st Semester', is_active:true };

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [editing, setEditing] = useState(null); // null | EMPTY | course object
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [deleting,setDeleting]= useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await adminFetchAllCourses();
      if (err) throw err;
      setCourses(data || []);
    } catch (e) { toast.error('Load failed: ' + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = courses.filter(c =>
    c.course_code?.toLowerCase().includes(search.toLowerCase()) ||
    c.course_title?.toLowerCase().includes(search.toLowerCase()) ||
    c.teacher?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing.course_code || !editing.course_title) { setError('Course code and title are required.'); return; }
    setSaving(true); setError('');
    try {
      const { error: err } = await adminUpsertCourse(editing);
      if (err) throw err;
      toast.success(editing.id ? 'Course updated!' : 'Course added!');
      setEditing(null);
      load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await adminDeleteCourse(id);
      setCourses(c => c.filter(x => x.id !== id));
      toast.success('Course deleted.');
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  const BADGE_MAP = { Theory:'theory', Lab:'lab', Project:'project' };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Courses</h1>
            <p className="text-sm text-gray-400 mt-1">{courses.length} courses in database</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={15}/>} onClick={() => setEditing({ ...EMPTY })}>
            Add Course
          </Button>
        </div>

        {/* Edit Modal */}
        {editing && (
          <Card className="mb-6 p-6 border-brand-200 dark:border-brand-500/30">
            <h3 className="font-bold text-sm text-gray-700 dark:text-dk-text mb-4">{editing.id ? 'Edit Course' : 'New Course'}</h3>
            {error && <Alert type="error" className="mb-4">{error}</Alert>}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Course Code" value={editing.course_code} onChange={e => setEditing(f => ({...f, course_code: e.target.value}))} placeholder="e.g. CSE 2202" />
              <Input label="Course Title" value={editing.course_title} onChange={e => setEditing(f => ({...f, course_title: e.target.value}))} />
              <Select label="Type" value={editing.course_type} onChange={e => setEditing(f => ({...f, course_type: e.target.value}))}>
                <option>Theory</option><option>Lab</option><option>Project</option>
              </Select>
              <Select label="Semester" value={editing.semester} onChange={e => setEditing(f => ({...f, semester: e.target.value}))}>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="primary" size="sm" icon={<Check size={14}/>} onClick={handleSave} loading={saving}>Save</Button>
              <Button variant="secondary" size="sm" icon={<X size={14}/>} onClick={() => { setEditing(null); setError(''); }}>Cancel</Button>
            </div>
          </Card>
        )}

        {/* Search */}
        <Input
          className="mb-4 max-w-sm"
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search size={15} />}
        />

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2">
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide">Code</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide">Title</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide hidden lg:table-cell">Semester</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide hidden lg:table-cell">Teacher</th>
                    <th className="text-right px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surf-border dark:divide-dk-border">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-surf-2 dark:hover:bg-dk-card2 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-brand-500 text-xs">{c.course_code}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-gray-800 dark:text-dk-text">{c.course_title}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <Badge variant={BADGE_MAP[c.course_type] || 'default'}>{c.course_type}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500 dark:text-dk-muted text-xs">{c.semester}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500 dark:text-dk-muted text-xs">{c.teacher?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="xs" icon={<Pencil size={12}/>} onClick={() => setEditing({ ...c })} />
                          <Button variant="danger" size="xs" icon={<Trash2 size={12}/>} loading={deleting === c.id} onClick={() => handleDelete(c.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No courses found.</div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
