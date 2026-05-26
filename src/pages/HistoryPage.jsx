import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, RefreshCw, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { fetchHistory, deleteHistoryEntry } from '../lib/supabase';
import { Card, Button, Spinner, Badge } from '../components/ui';

export const HistoryPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await fetchHistory(user.id);
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      toast.error('Could not load history: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteHistoryEntry(id);
      setItems(items => items.filter(i => i.id !== id));
      toast.success('Entry deleted.');
    } catch (e) {
      toast.error('Delete failed: ' + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleReuse = (item) => {
    navigate('/generator');
    toast('Open the Generator — data pre-fill coming in v2.0');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex items-center justify-center">
              <History size={18} className="text-brand-500" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-gray-900 dark:text-dk-text">Generation History</h1>
              <p className="text-sm text-gray-400">Last 20 front pages you generated</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={<RefreshCw size={14}/>} onClick={load}>Refresh</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : items.length === 0 ? (
          <Card className="py-20 text-center">
            <FileText size={40} className="text-gray-200 dark:text-dk-border mx-auto mb-4" />
            <p className="font-semibold text-gray-500 dark:text-dk-muted">No history yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Generate your first front page to see it here.</p>
            <Button variant="primary" onClick={() => navigate('/generator')}>Go to Generator</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <Card key={item.id} className="p-5 hover:shadow-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-gray-800 dark:text-dk-text truncate">{item.topic || 'Untitled'}</h3>
                      {item.semester_override && <Badge variant="brand">{item.semester_override}</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-dk-muted truncate">{item.university_name_override}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {item.submission_date
  ? item.submission_date.split('-').reverse().join('/')
  : new Date(item.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                      </span>
                      <span>{item.student_name}</span>
                      <span>{item.semester_override}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="secondary" size="xs" icon={<RefreshCw size={12}/>} onClick={() => handleReuse(item)}>
                      Reuse
                    </Button>
                    <Button
                      variant="danger" size="xs"
                      icon={deleting === item.id ? null : <Trash2 size={12}/>}
                      loading={deleting === item.id}
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};