import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, Layers, ChevronRight,
  TrendingUp, Database, Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, Spinner } from '../../components/ui';
import clsx from 'clsx';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-dk-text">{value ?? '—'}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </Card>
);

const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} className={clsx(
      'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
      active ? 'bg-brand-500 text-white shadow-card' : 'text-gray-500 dark:text-dk-muted hover:bg-surf-2 dark:hover:bg-dk-card2 hover:text-brand-500'
    )}>
      <Icon size={16} />{label}<ChevronRight size={13} className="ml-auto opacity-50" />
    </Link>
  );
};

export const AdminDashboard = () => {
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ count: users }, { count: courses }, { count: teachers }, { count: history }] = await Promise.all([
          supabase.from('users').select('*', { count:'exact', head:true }),
          supabase.from('courses').select('*', { count:'exact', head:true }),
          supabase.from('teachers').select('*', { count:'exact', head:true }),
          supabase.from('history').select('*', { count:'exact', head:true }),
        ]);
        setStats({ users, courses, teachers, history });
      } catch { setStats({ users:'—', courses:'—', teachers:'—', history:'—' }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-6">

          {/* Sidebar */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Admin Panel</p>
            <NavItem to="/admin"          icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/courses"  icon={BookOpen}        label="Courses" />
            <NavItem to="/admin/teachers" icon={GraduationCap}   label="Teachers" />
            <NavItem to="/admin/students" icon={Users}           label="Students" />
            <NavItem to="/admin/templates"icon={Layers}          label="Templates" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-dk-text">Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Overview of KYAU Front Page Generator.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard icon={Users}        label="Total Students"      value={stats.users}    color="bg-brand-500" />
                <StatCard icon={BookOpen}     label="Courses"             value={stats.courses}  color="bg-violet-500" />
                <StatCard icon={GraduationCap}label="Teachers"            value={stats.teachers} color="bg-teal-500" />
                <StatCard icon={Activity}     label="Pages Generated"     value={stats.history}  color="bg-amber-500" />
              </div>
            )}

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-brand-500" />
                <h2 className="font-bold text-sm text-gray-700 dark:text-dk-text">Quick Actions</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { to:'/admin/courses',   label:'Add Course',   icon:BookOpen },
                  { to:'/admin/teachers',  label:'Add Teacher',  icon:GraduationCap },
                  { to:'/admin/students',  label:'View Students',icon:Users },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-2.5 p-4 rounded-xl border border-surf-border dark:border-dk-border hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all group">
                    <Icon size={16} className="text-brand-500" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-dk-text group-hover:text-brand-500">{label}</span>
                    <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-brand-400" />
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database size={16} className="text-brand-500" />
                <h2 className="font-bold text-sm text-gray-700 dark:text-dk-text">System Info</h2>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Database',   'Supabase (PostgreSQL)'],
                  ['Frontend',   'React + Tailwind CSS'],
                  ['PDF Export', 'jsPDF + html2canvas'],
                  ['DOCX Export','docx.js (client-side)'],
                  ['Hosting',    'Vercel'],
                  ['Auth',       'Supabase Auth (Email OTP + Google OAuth)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-surf-border dark:border-dk-border last:border-0">
                    <span className="text-gray-500 dark:text-dk-muted font-medium">{k}</span>
                    <span className="text-gray-700 dark:text-dk-text font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
