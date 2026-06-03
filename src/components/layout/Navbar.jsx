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

const NavLink = ({ to, icon: Icon, label, mobile, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 font-body font-semibold text-sm transition-all duration-150 rounded-xl',
        mobile
          ? 'w-full px-4 py-3.5'
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

  // Close mobile menu on route change
  const { pathname } = useLocation();
  useEffect(() => setMobOpen(false), [pathname]);

  const handleLogout = async () => {
    await signOut();
    setDropOpen(false);
    setMobOpen(false);
    navigate('/');
  };

  const avatar = profile?.avatar_url;
  const initials = (profile?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dk-bg/90 backdrop-blur-xl border-b border-surf-border dark:border-dk-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-[60px] gap-3 sm:gap-4">

            {/* ── Brand ── */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 mr-1 sm:mr-2">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-brand-500 dark:text-brand-300 text-[15px] tracking-tight">ALIF</span>
                <span className="hidden xs:block text-[9px] font-body text-gray-400 dark:text-gray-300 uppercase tracking-[0.15em] mt-0.5">Front Page</span>
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
            <div className="flex-1" />

            {/* ── Right controls ── */}
            <div className="flex items-center gap-1 sm:gap-1.5">

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
                  {/* User dropdown — desktop */}
                  <div className="relative hidden sm:block" ref={dropRef}>
                    <button
                      onClick={() => setDropOpen(d => !d)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-dk-text hover:bg-surf-2 dark:hover:bg-dk-card transition-all"
                    >
                      {avatar
                        ? <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-surf-border" />
                        : <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                      }
                      <span className="max-w-[110px] truncate">
                        {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown size={14} className={clsx('transition-transform duration-200', dropOpen && 'rotate-180')} />
                    </button>

                    {dropOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-hover z-50 overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 border-b border-surf-border dark:border-dk-border bg-surf-2 dark:bg-dk-card2">
                          <p className="text-sm font-bold dark:text-dk-text truncate">{profile?.full_name || '—'}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          {profile?.student_id && <p className="text-xs text-gray-400">ID: {profile.student_id}</p>}
                        </div>
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

                  {/* Mobile: avatar button (opens drawer) */}
                  <button
                    onClick={() => setMobOpen(m => !m)}
                    className="sm:hidden flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-surf-2 dark:hover:bg-dk-card transition-all"
                  >
                    {avatar
                      ? <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-surf-border" />
                      : <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                    }
                    {mobOpen ? <X size={15} className="text-gray-400" /> : <Menu size={15} className="text-gray-400" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link to="/login"
                    className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold text-brand-500 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all">
  Sign In
                  </Link>
                  <Link to="/login"
                    className="sm:hidden flex items-center px-3 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile nav drawer ─────────────────────────────────────── */}
        {mobOpen && user && (
          <div className="sm:hidden border-t border-surf-border dark:border-dk-border bg-white dark:bg-dk-bg animate-fade-in">
            {/* User info strip */}
            <div className="flex items-center gap-3 px-4 py-3 bg-surf-2 dark:bg-dk-card2 border-b border-surf-border dark:border-dk-border">
              {avatar
                ? <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-brand-200" />
                : <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold">{initials}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold dark:text-dk-text truncate">{profile?.full_name || '—'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            {/* Nav links */}
            <div className="p-3 space-y-1">
              <NavLink to="/generator" icon={FileText}       label="Generator" mobile onClick={() => setMobOpen(false)} />
              <NavLink to="/history"   icon={History}        label="History"   mobile onClick={() => setMobOpen(false)} />
              {isAdmin && <NavLink to="/admin" icon={LayoutDashboard} label="Admin" mobile onClick={() => setMobOpen(false)} />}
              <NavLink to="/settings"  icon={Settings}       label="Settings"  mobile onClick={() => setMobOpen(false)} />
              <div className="border-t border-surf-border dark:border-dk-border my-2" />
              <button onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
