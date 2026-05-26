import React from 'react';
import clsx from 'clsx';

/* ── Button ──────────────────────────────────────────────────────── */
export const Button = ({ children, variant = 'primary', size = 'md', className, loading, icon, ...p }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  const sz   = { xs:'px-3 py-1.5 text-xs', sm:'px-4 py-2 text-sm', md:'px-5 py-2.5 text-sm', lg:'px-6 py-3 text-base', xl:'px-8 py-4 text-base' };
  const vars = {
    primary:   'bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white shadow-card hover:shadow-hover',
    secondary: 'bg-surf-2 hover:bg-surf-3 text-brand-500 border border-surf-border dark:bg-dk-card dark:hover:bg-dk-card2 dark:text-dk-text dark:border-dk-border',
    accent:    'bg-accent hover:bg-accent-dark active:scale-[.98] text-white shadow-card',
    ghost:     'hover:bg-surf-2 text-gray-600 dark:text-dk-muted dark:hover:bg-dk-card',
    outline:   'border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10',
    danger:    'bg-red-500 hover:bg-red-600 text-white',
    white:     'bg-white hover:bg-gray-50 text-brand-500 shadow-card',
  };
  return (
    <button className={clsx(base, sz[size], vars[variant], className)} disabled={loading || p.disabled} {...p}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </button>
  );
};

/* ── Input ───────────────────────────────────────────────────────── */
export const Input = ({ label, error, hint, icon, suffix, className, ...p }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-dk-text">{label}</label>}
    <div className="relative">
      {icon   && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>}
      {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{suffix}</span>}
      <input
        className={clsx(
          'w-full rounded-xl border bg-white dark:bg-dk-card dark:text-dk-text text-sm py-2.5 transition-all outline-none',
          'border-surf-border dark:border-dk-border placeholder:text-gray-300 dark:placeholder:text-dk-muted',
          'focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-200/40',
          icon   ? 'pl-10' : 'pl-4',
          suffix ? 'pr-10' : 'pr-4',
          className
        )}
        {...p}
      />
    </div>
    {hint  && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
  </div>
);

/* ── Textarea ────────────────────────────────────────────────────── */
export const Textarea = ({ label, error, className, ...p }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-dk-text">{label}</label>}
    <textarea
      rows={3}
      className={clsx(
        'w-full rounded-xl border bg-white dark:bg-dk-card dark:text-dk-text text-sm px-4 py-2.5 transition-all outline-none resize-none',
        'border-surf-border dark:border-dk-border focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
        error && 'border-red-400',
        className
      )}
      {...p}
    />
    {error && <p className="text-xs text-red-500">⚠ {error}</p>}
  </div>
);

/* ── Select ──────────────────────────────────────────────────────── */
export const Select = ({ label, error, children, className, ...p }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-gray-700 dark:text-dk-text">{label}</label>}
    <select
      className={clsx(
        'w-full rounded-xl border bg-white dark:bg-dk-card dark:text-dk-text text-sm px-4 py-2.5 transition-all outline-none cursor-pointer',
        'border-surf-border dark:border-dk-border focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
        error && 'border-red-400',
        className
      )}
      {...p}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">⚠ {error}</p>}
  </div>
);

/* ── Card ────────────────────────────────────────────────────────── */
export const Card = ({ children, className, hover, ...p }) => (
  <div
    className={clsx(
      'bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card',
      hover && 'hover:shadow-hover transition-shadow duration-200 cursor-pointer',
      className
    )}
    {...p}
  >
    {children}
  </div>
);

/* ── Badge ───────────────────────────────────────────────────────── */
export const Badge = ({ children, variant = 'default', className }) => {
  const v = {
    default: 'bg-surf-2 text-gray-600 border-surf-border dark:bg-dk-card2 dark:text-dk-muted dark:border-dk-border',
    brand:   'bg-brand-50 text-brand-500 border-brand-200 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-green-50 text-green-700 border-green-200',
    theory:  'bg-blue-50 text-blue-700 border-blue-200',
    lab:     'bg-violet-50 text-violet-700 border-violet-200',
    project: 'bg-amber-50 text-amber-700 border-amber-200',
    accent:  'bg-accent/10 text-accent-dark border-accent/30',
  };
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', v[variant] || v.default, className)}>
      {children}
    </span>
  );
};

/* ── Spinner ─────────────────────────────────────────────────────── */
export const Spinner = ({ size = 'md', className }) => {
  const s = { sm:'w-4 h-4 border-2', md:'w-6 h-6 border-2', lg:'w-9 h-9 border-3', xl:'w-14 h-14 border-4' };
  return <div className={clsx('border-brand-200 border-t-brand-500 rounded-full animate-spin', s[size], className)} />;
};

/* ── PageLoader ──────────────────────────────────────────────────── */
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surf-2 dark:bg-dk-bg">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <Spinner size="xl" />
      <p className="text-sm text-gray-400 font-body">Loading…</p>
    </div>
  </div>
);

/* ── Divider ─────────────────────────────────────────────────────── */
export const Divider = ({ label }) => (
  <div className="relative my-5">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-surf-border dark:border-dk-border" />
    </div>
    {label && (
      <div className="relative flex justify-center">
        <span className="px-3 text-xs font-medium text-gray-400 bg-white dark:bg-dk-card">{label}</span>
      </div>
    )}
  </div>
);

/* ── Alert ───────────────────────────────────────────────────────── */
export const Alert = ({ type = 'info', children, className }) => {
  const s = {
    info:    'bg-blue-50   border-blue-200   text-blue-700   dark:bg-blue-900/20   dark:border-blue-800/50   dark:text-blue-300',
    error:   'bg-red-50    border-red-200    text-red-700    dark:bg-red-900/20    dark:border-red-800/50    dark:text-red-300',
    success: 'bg-green-50  border-green-200  text-green-700  dark:bg-green-900/20  dark:border-green-800/50  dark:text-green-300',
    warning: 'bg-amber-50  border-amber-200  text-amber-700  dark:bg-amber-900/20  dark:border-amber-800/50  dark:text-amber-300',
  };
  return (
    <div className={clsx('text-sm px-4 py-3 rounded-xl border', s[type], className)}>
      {children}
    </div>
  );
};

/* ── Toggle ──────────────────────────────────────────────────────── */
export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none group">
    <div
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-dk-border'
      )}
    >
      <span
        className={clsx(
          'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
          checked && 'translate-x-5'
        )}
      />
    </div>
    {label && <span className="text-sm font-medium text-gray-700 dark:text-dk-text">{label}</span>}
  </label>
);
