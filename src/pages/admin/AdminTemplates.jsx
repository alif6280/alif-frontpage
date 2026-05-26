import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminFetchTemplates, adminToggleTemplate } from '../../lib/supabase';
import { Card, Badge, Toggle, Spinner } from '../../components/ui';
import { TEMPLATES as LOCAL_TEMPLATES } from '../../data/courses';

export const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await adminFetchTemplates();
        if (error || !data?.length) {
          // Fallback to local template list
          setTemplates(LOCAL_TEMPLATES.map((t, i) => ({ id: t.id, name: t.name, description: t.desc, is_active: true, is_default: t.default || false })));
        } else {
          setTemplates(data);
        }
      } catch {
        setTemplates(LOCAL_TEMPLATES.map((t) => ({ id: t.id, name: t.name, description: t.desc, is_active: true, is_default: t.default || false })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggle = async (id, is_active) => {
    try {
      await adminToggleTemplate(id, is_active);
      setTemplates(ts => ts.map(t => t.id === id ? { ...t, is_active } : t));
      toast.success(is_active ? 'Template enabled.' : 'Template disabled.');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const GRADIENT_MAP = {
    kyau:     'from-brand-500 to-brand-700',
    modern:   'from-slate-500 to-slate-700',
    minimal:  'from-gray-200 to-gray-300',
    dark:     'from-slate-900 to-slate-800',
    colorful: 'from-teal-500 to-cyan-600',
    thesis:   'from-amber-500 to-orange-600',
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Templates</h1>
          <p className="text-sm text-gray-400 mt-1">Enable or disable templates visible to students.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map(tpl => (
              <Card key={tpl.id} className="overflow-hidden">
                <div className={`bg-gradient-to-br ${GRADIENT_MAP[tpl.id] || 'from-gray-400 to-gray-600'} h-28 flex items-center justify-center`}>
                  <div className="text-white text-center">
                    <p className="font-bold text-sm tracking-wide">{tpl.name}</p>
                    {tpl.is_default && <Badge variant="accent" className="mt-1.5">Default</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 leading-snug mb-4">{tpl.description || tpl.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-dk-muted">
                      {tpl.is_active ? 'Visible to students' : 'Hidden'}
                    </span>
                    <Toggle
                      checked={!!tpl.is_active}
                      onChange={(val) => handleToggle(tpl.id, val)}
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
