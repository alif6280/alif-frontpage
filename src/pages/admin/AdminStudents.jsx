import React, { useEffect, useState } from 'react';
import { Search, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminFetchAllUsers } from '../../lib/supabase';
import { Input, Card, Badge, Spinner } from '../../components/ui';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await adminFetchAllUsers();
        if (error) throw error;
        setStudents(data || []);
      } catch (e) { toast.error(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = students.filter(s =>
    s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Students</h1>
          <p className="text-sm text-gray-400 mt-1">{students.length} registered students</p>
        </div>

        <Input className="mb-4 max-w-sm" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={15} />} />

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2">
                    {['Name','Student ID','Email','Dept.','Batch','Role','Joined'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-bold text-gray-600 dark:text-dk-muted text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surf-border dark:divide-dk-border">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-surf-2 dark:hover:bg-dk-card2 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {s.avatar_url
                            ? <img src={s.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                            : <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{(s.full_name||'?').charAt(0)}</div>
                          }
                          <span className="font-semibold text-gray-800 dark:text-dk-text">{s.full_name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-dk-muted">{s.student_id || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-dk-muted text-xs">{s.email}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-dk-muted text-xs">{s.department?.substring(0,3) || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-dk-muted text-xs">{s.batch || '—'}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={s.role === 'admin' ? 'accent' : 'brand'}>{s.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {new Date(s.created_at).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-16 text-gray-400">
                  <UserX size={32} className="mb-2" />
                  <span className="text-sm">No students found.</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
