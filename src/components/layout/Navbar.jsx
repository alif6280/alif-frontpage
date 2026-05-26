import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Moon, Sun, BookOpen, History, LayoutDashboard,
  Settings, LogOut, ChevronDown, Menu, X, FileText
} from 'lucide-react';
import { useAuth }  from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { signOut }  from '../../lib/supabase';
import clsx from 'clsx';

const NavLink = ({ to, icon: Icon, label, mobile }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-2 font-body font-semibold text-sm transition-all duration-150 rounded-xl',
        mobile
          ? 'w-full px-4 py-3'
          : 'px-3.5 py-2',
        active
          ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-300'
          : 'text-gray-500 hover:text-brand-500 hover:bg-surf-2 dark:text-dk-muted dark:hover:text-dk-text dark:hover:bg-dk-card'
      )}
    >
      <Icon size={16} strokeWidth={2.2} />
      {label}
    </Link>
  );
};

export const Navbar = () => {
  const { user, profile }    = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate             = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobOpen,  setMobOpen]  = useState(false);
  const dropRef = useRef(null);

  const isAdmin = profile?.role === 'admin';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setDropOpen(false);
    navigate('/');
  };

  const avatar = profile?.avatar_url;
  const initials = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dk-bg/90 backdrop-blur-xl border-b border-surf-border dark:border-dk-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-4">

            {/* ── Brand ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block leading-none">
                <span className="font-display font-bold text-brand-500 text-[15px] tracking-tight">KYAU</span>
                <span className="block text-[9px] font-body text-gray-400 uppercase tracking-[0.15em] mt-0.5">Front Page</span>
              </div>
            </Link>

            {/* ── Desktop Nav Links (logged-in) ── */}
            {user && (
              <div className="hidden md:flex items-center gap-1 flex-1">
                <NavLink to="/generator" icon={FileText}       label="Generator" />
                <NavLink to="/history"   icon={History}        label="History" />
                {isAdmin && <NavLink to="/admin" icon={LayoutDashboard} label="Admin" />}
              </div>
            )}

            {/* ── Spacer ── */}
            <div className="flex-1 md:flex-none" />

            {/* ── Right controls ── */}
            <div className="flex items-center gap-1.5">

              {/* Theme toggle */}
              <button
                onClick={toggleDark}
                className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-surf-2 dark:hover:bg-dk-card transition-all"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
              </button>

              {user ? (
                <>
                  {/* User dropdown */}
                  <div className="relative" ref={dropRef}>
                    <button
                      onClick={() => setDropOpen(d => !d)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-dk-text hover:bg-surf-2 dark:hover:bg-dk-card transition-all"
                    >
                      {avatar
                        ? <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-surf-border" />
                        : <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                      }
                      <span className="hidden sm:block max-w-[110px] truncate">
                        {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown size={14} className={clsx('transition-transform duration-200', dropOpen && 'rotate-180')} />
                    </button>

                    {dropOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-hover z-50 overflow-hidden animate-fade-in">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2">
                          <p className="text-sm font-bold dark:text-dk-text truncate">{profile?.full_name || '—'}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          {profile?.student_id && <p className="text-xs text-gray-400">ID: {profile.student_id}</p>}
                        </div>
                        {/* Links */}
                        <div className="p-1.5">
                          <Link to="/settings" onClick={() => setDropOpen(false)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-600 dark:text-dk-text hover:bg-surf-2 dark:hover:bg-dk-card2 rounded-xl transition-all">
                            <Settings size={15} /> Settings
                          </Link>
                          <div className="border-t border-surf-border dark:border-dk-border my-1" />
                          <button onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile hamburger */}
                  <button onClick={() => setMobOpen(m => !m)}
                    className="md:hidden p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-surf-2 dark:hover:bg-dk-card transition-all">
                    {mobOpen ? <X size={18} /> : <Menu size={18} />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="flex items-center px-4 py-2 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobOpen && user && (
          <div className="md:hidden border-t border-surf-border dark:border-dk-border bg-white dark:bg-dk-bg animate-fade-in">
            <div className="p-3 space-y-1">
              <NavLink to="/generator" icon={FileText}       label="Generator" mobile />
              <NavLink to="/history"   icon={History}        label="History"   mobile />
              {isAdmin && <NavLink to="/admin" icon={LayoutDashboard} label="Admin" mobile />}
              <NavLink to="/settings"  icon={Settings}       label="Settings"  mobile />
              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
