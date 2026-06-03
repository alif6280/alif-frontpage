import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Download, Eye, Shield, BookOpen, FileText, Users } from 'lucide-react';
import { Button } from '../components/ui';
import { TEMPLATES } from '../data/courses';

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-3 sm:gap-4">
    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
      <Icon size={17} className="text-brand-500 dark:text-brand-300" strokeWidth={2.2} />
    </div>
    <div>
      <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{title}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TemplateCard = ({ tpl, i }) => {
  const colors = ['from-brand-500 to-brand-600','from-violet-500 to-purple-600','from-slate-500 to-slate-700','from-slate-900 to-slate-800','from-teal-500 to-cyan-600','from-amber-500 to-orange-600'];
  return (
    <Link to="/register" className="block group">
      <div className="rounded-2xl overflow-hidden border border-surf-border dark:border-dk-border shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
        <div className={`bg-gradient-to-br ${colors[i]} h-24 sm:h-32 flex items-center justify-center`}>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2.5 sm:p-3 text-white text-center">
            <FileText size={18} className="mx-auto mb-1 opacity-80" />
            <p className="text-[10px] sm:text-xs font-bold tracking-wide leading-tight">{tpl.name}</p>
          </div>
        </div>
        <div className="p-3 sm:p-4 bg-white dark:bg-dk-card">
          <p className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-white leading-tight">{tpl.name}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-snug line-clamp-2">{tpl.desc}</p>
        </div>
      </div>
    </Link>
  );
};

export const LandingPage = () => (
  <div className="min-h-screen bg-white dark:bg-dk-bg">
    {/* ── Hero ─────────────────────────────────────────────────────── */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-surf-2 dark:from-brand-900/20 dark:via-dk-bg dark:to-dk-bg pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-14 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 rounded-full text-xs font-bold text-brand-500 dark:text-brand-300 mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 bg-brand-500 dark:bg-brand-300 rounded-full animate-pulse" />
          <span className="text-[10px] sm:text-xs">KYAU CSE Department · Free Forever</span>
        </div>

        <h1 className="font-display font-bold text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 tracking-tight">
          Assignment Front Pages,{' '}
          <span className="text-brand-500 dark:text-brand-300 relative inline-block">
            Done in Seconds
            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none">
              <path d="M 0 8 Q 200 0 400 8" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-body px-2 sm:px-0">
          Register once, auto-fill forever. Select your course and topic — your pixel-perfect cover page is ready. Export PDF or DOCX in one click.
        </p>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <Link to="/register" className="w-full xs:w-auto sm:w-auto">
            <Button size="xl" variant="primary" icon={<Zap size={18} />} className="w-full sm:w-auto">
              Generate Your Front Page
            </Button>
          </Link>
          <Link to="/login" className="w-full xs:w-auto sm:w-auto">
            <Button size="xl" variant="secondary" icon={<ArrowRight size={16} />} className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8 mt-10 sm:mt-14 px-4 sm:px-0">
          {[['60+','Courses Pre-loaded'],['6','Templates'],['100%','Free'],['KYAU + Any','University']].map(([n,l]) => (
            <div key={l} className="text-center py-3 sm:py-0 bg-surf-2 dark:bg-dk-card sm:bg-transparent sm:dark:bg-transparent rounded-2xl sm:rounded-none px-4 sm:px-0">
              <p className="font-display font-bold text-xl sm:text-2xl text-brand-500 dark:text-brand-300">{n}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ─────────────────────────────────────────────────── */}
    <section className="py-14 sm:py-20 bg-surf-2 dark:bg-dk-card2/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Why Students Love It</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-2">Everything you need, nothing you don't</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <Feature icon={Zap}      title="Zero Repetitive Typing"     desc="Register once with your name, ID, batch, and semester. Every return visit auto-fills all fields instantly." />
          <Feature icon={Eye}      title="Live Canva-style Preview"    desc="See your front page update in real-time as you type. No refreshing, no guessing." />
          <Feature icon={BookOpen} title="60+ KYAU Courses Pre-loaded" desc="All CSE courses across all 8 semesters with teacher names and designations — just search and select." />
          <Feature icon={Download} title="PDF & DOCX Export"          desc="One-click export to pixel-perfect A4 PDF or an editable Word document." />
          <Feature icon={Users}    title="Multi-University Support"    desc="Not from KYAU? Change the university name and fill details manually — works for any institution." />
          <Feature icon={Shield}   title="Secure & Free"               desc="Powered by Supabase + Vercel. No ads, no tracking, no paywalls. Always free." />
        </div>
      </div>
    </section>

    {/* ── Templates ────────────────────────────────────────────────── */}
    <section className="py-14 sm:py-20 bg-white dark:bg-dk-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Templates</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">6 Professional Styles</h2>
          <p className="text-gray-400 dark:text-slate-500 mt-3 text-sm sm:text-base">From official KYAU format to minimal editorial — pick your style.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {TEMPLATES.map((tpl, i) => <TemplateCard key={tpl.id} tpl={tpl} i={i} />)}
        </div>
        <div className="text-center mt-8 sm:mt-10">
          <Link to="/register">
            <Button size="lg" variant="primary">Get Started Free <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── Footer ───────────────────────────────────────────────────── */}
    <footer className="border-t border-surf-border dark:border-dk-border py-6 sm:py-8 bg-white dark:bg-dk-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <BookOpen size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-500 dark:text-brand-300 text-sm">Front Page Generator</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center sm:text-right">© {new Date().getFullYear()} · Built by MD. Montasir Monir Alif · Free & Open</p>
      </div>
    </footer>
  </div>
);
