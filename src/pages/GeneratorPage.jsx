import React, { useState, useCallback, useRef } from 'react';
import { Download, FileText, Printer, RotateCcw, Search, ChevronDown, Pencil, Layers, Upload, FileText as FileIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Select, Badge } from '../components/ui';
import { FrontPagePreview } from '../components/FrontPagePreview';
import { exportToPDF, exportToDOCX } from '../lib/export';
import { SEMESTERS, BATCHES, TEMPLATES, DEPARTMENTS, getCoursesBySemester, searchCoursesLocal } from '../data/courses';
import { saveHistory } from '../lib/supabase';
import clsx from 'clsx';

const BADGE_MAP = { Theory: 'theory', Lab: 'lab', Project: 'project' };

/* ─── Report Type Picker ──────────────────────────────────────────── */
const REPORT_TYPES = [
  { id: 'Assignment', label: 'Assignment', icon: '📝' },
  { id: 'Lab',        label: 'Lab Report', icon: '🔬' },
  { id: 'Thesis',     label: 'Thesis',     icon: '📚' },
];

const ReportTypePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {REPORT_TYPES.map(t => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={clsx(
          'flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-semibold transition-all',
          value === t.id
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-500'
            : 'border-surf-border dark:border-dk-border text-gray-500 dark:text-dk-muted hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2'
        )}
      >
        <span className="text-lg">{t.icon}</span>
        {t.label}
      </button>
    ))}
  </div>
);

/* ─── Template Picker ─────────────────────────────────────────────── */
const TemplatePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {TEMPLATES.map(tpl => (
      <button
        key={tpl.id}
        onClick={() => onChange(tpl.id)}
        className={clsx(
          'text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all',
          value === tpl.id
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-500'
            : 'border-surf-border dark:border-dk-border text-gray-500 dark:text-dk-muted hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2'
        )}
      >
        <Layers size={13} className="mb-1" />
        {tpl.name}
      </button>
    ))}
  </div>
);

/* ─── Logo Uploader ───────────────────────────────────────────────── */
const LogoUploader = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-600 dark:text-dk-muted">University Logo</p>
      <div
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all',
          value
            ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
            : 'border-surf-border dark:border-dk-border hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2'
        )}
      >
        {value ? (
          <>
            <img src={value} alt="logo" className="w-10 h-10 object-contain rounded-full border border-gray-200" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-brand-500">Logo uploaded ✓</p>
              <p className="text-xs text-gray-400">Click to change</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dk-card2 flex items-center justify-center">
              <Upload size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-dk-muted">Upload Logo</p>
              <p className="text-xs text-gray-400">PNG, JPG supported</p>
            </div>
          </>
        )}
      </div>
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-xs text-red-400 hover:text-red-500 transition-colors"
        >
          Remove logo
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

/* ─── Course Search Dropdown ──────────────────────────────────────── */
const CourseSearch = ({ semester, onSelect }) => {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const ref = useRef(null);

  const handleSearch = (q) => {
    setQuery(q);
    if (q.length < 1) { setResults(getCoursesBySemester(semester)); }
    else { setResults(searchCoursesLocal(q)); }
    setOpen(true);
  };

  const handleFocus = () => {
    setResults(getCoursesBySemester(semester));
    setOpen(true);
  };

  const pick = (c) => {
    onSelect(c);
    setQuery(`${c.code} — ${c.title}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <Input
        label="Course"
        placeholder="Search by name or code…"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        icon={<Search size={15} />}
        suffix={<ChevronDown size={13} className={clsx('transition-transform', open && 'rotate-180')} />}
      />
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full bg-white dark:bg-dk-card rounded-xl border border-surf-border dark:border-dk-border shadow-hover max-h-52 overflow-y-auto animate-fade-in">
          {results.map(c => (
            <button
              key={c.code}
              onMouseDown={() => pick(c)}
              className="w-full text-left px-4 py-2.5 hover:bg-surf-2 dark:hover:bg-dk-card2 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <span className="text-xs font-mono font-bold text-brand-500">{c.code}</span>
                <p className="text-sm text-gray-700 dark:text-dk-text leading-tight mt-0.5">{c.title}</p>
                <p className="text-xs text-gray-400">{c.teacher?.name}</p>
              </div>
              <Badge variant={BADGE_MAP[c.type] || 'default'}>{c.type}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Editable field ──────────────────────────────────────────────── */
const EditableInput = ({ label, ...props }) => (
  <Input label={label} suffix={<Pencil size={12} className="text-gray-300" />} {...props} />
);

/* ══════════════════════════════════════════════════════════════════ */
/*  Main Generator Page                                               */
/* ══════════════════════════════════════════════════════════════════ */
export const GeneratorPage = () => {
  const { profile } = useAuth();
  const [template,  setTemplate]  = useState('kyau');
  const [exporting, setExporting] = useState(false);

  const defaultForm = useCallback(() => ({
    universityName: profile?.university_name || 'Khwaja Yunus Ali University',
    department:     profile?.department      || 'Computer Science and Engineering',
    semester:       profile?.semester        || '1st Year 1st Semester',
    courseCode:     '',
    courseTitle:    '',
    courseType:     'Assignment',
    teacherName:    '',
    designation:    '',
    studentName:    profile?.full_name   || '',
    studentId:      profile?.student_id  || '',
    batch:          profile?.batch       || '1st Batch',
    topic:          '',
    submissionDate: new Date().toISOString().split('T')[0],
    logoUrl:        '',
    teacherDepartment: 'Department of CSE',
  }), [profile]);

  const [form, setForm] = useState(defaultForm);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: typeof e === 'string' ? e : e.target.value }));

  const onCourseSelect = (c) => {
    setForm(f => ({
      ...f,
      courseCode:  c.code,
      courseTitle: c.title,
      courseType:  c.type || f.courseType,
      teacherName: c.teacher?.name        || '',
      designation: c.teacher?.designation || '',
    }));
  };

  const handleReset = () => {
    setForm(defaultForm());
    toast('Fields reset to your profile info.');
  };

  const handlePDF = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setExporting(true);
    try {
      await exportToPDF('front-page-preview', `${form.topic.replace(/\s+/g, '-')}-front-page.pdf`);
      await saveHistory({ ...form, template_id: template }).catch(() => {});
      toast.success('PDF downloaded!');
    } catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  const handleDOCX = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setExporting(true);
    try {
      await exportToDOCX(form);
      toast.success('DOCX downloaded!');
    } catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  const handlePrint = () => {
    const el = document.getElementById('front-page-preview');
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><style>body{margin:0;padding:0;}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style></head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surf-2 dark:bg-dk-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900 dark:text-dk-text">Front Page Generator</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Fill in the details'} — your fields are auto-filled from your profile.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl transition-all"
          >
            <RotateCcw size={13} /> Reset to my info
          </button>
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">

          {/* ══ LEFT PANEL ══════════════════════════════════════════ */}
          <div className="space-y-5">

            {/* 1. Report Type */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5">
              <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text mb-3 flex items-center gap-2">
                <FileIcon size={15} className="text-brand-500" /> Report Type
              </h3>
              <ReportTypePicker value={form.courseType} onChange={(v) => setForm(f => ({ ...f, courseType: v }))} />
            </div>

            {/* 2. University Logo + Name */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text">University</h3>
              <LogoUploader value={form.logoUrl} onChange={(v) => setForm(f => ({ ...f, logoUrl: v }))} />
              <EditableInput label="University Name" value={form.universityName} onChange={set('universityName')} />
              <Select label="Department" value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                <option value="Other">Other</option>
              </Select>
              <Select label="Semester" value={form.semester} onChange={set('semester')}>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            {/* 3. Course */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text">Course Details</h3>
              <CourseSearch semester={form.semester} onSelect={onCourseSelect} />
              <div className="grid grid-cols-2 gap-3">
                <EditableInput label="Course Code" value={form.courseCode} onChange={set('courseCode')} placeholder="e.g. CSE 2202" />
              </div>
              <EditableInput label="Course Title" value={form.courseTitle} onChange={set('courseTitle')} placeholder="Course Title" />
              <Input
                label="Topic / Title"
                value={form.topic}
                onChange={set('topic')}
                placeholder="Type your assignment topic…"
              />
              <Input label="Submission Date" type="date" value={form.submissionDate} onChange={set('submissionDate')} />
            </div>

            {/* 4. Teacher */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text">Teacher</h3>
              <EditableInput label="Teacher Name" value={form.teacherName} onChange={set('teacherName')} placeholder="Auto-filled from course" />
              <EditableInput label="Designation" value={form.designation} onChange={set('designation')} placeholder="Auto-filled from course" />
              <Select label="Teacher Department" value={form.teacherDepartment} onChange={set('teacherDepartment')}>
                <option value="Department of CSE">Department of CSE</option>
                <option value="Department of EEE">Department of EEE</option>
                <option value="Department of BBA">Department of BBA</option>
                <option value="Department of Law">Department of Law</option>
                <option value="Department of Pharmacy">Department of Pharmacy</option>
                <option value="Department of English">Department of English</option>
                <option value="Department of Mathematics">Department of Mathematics</option>
                <option value="Department of Physics">Department of Physics</option>
                <option value="Department of Statistics">Department of Statistics</option>
                <option value="Department of Economics">Department of Economics</option>
                <option value="Department of Humanities">Department of Humanities</option>
              </Select>
            </div>

            {/* 5. Student */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text">Student Details</h3>
                <span className="text-xs text-gray-400 italic">Editable (session-only)</span>
              </div>
              <EditableInput label="Student Name" value={form.studentName} onChange={set('studentName')} />
              <EditableInput label="Student ID" value={form.studentId} onChange={set('studentId')} />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Batch" value={form.batch} onChange={set('batch')}>
                  {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Semester" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </div>

            {/* 6. Template */}
            <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-5">
              <h3 className="text-sm font-bold text-gray-700 dark:text-dk-text mb-3 flex items-center gap-2">
                <Layers size={15} className="text-brand-500" /> Template Style
              </h3>
              <TemplatePicker value={template} onChange={setTemplate} />
            </div>

          </div>

          {/* ══ RIGHT PANEL — Preview ══════════════════════════════ */}
          <div className="sticky top-[76px]">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={handlePDF} loading={exporting}>
                Download PDF
              </Button>
              <Button variant="secondary" size="sm" icon={<FileText size={14} />} onClick={handleDOCX} loading={exporting}>
                Download DOCX
              </Button>
              <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>
                Print
              </Button>
            </div>

            <div className="bg-gray-100 dark:bg-dk-card2 rounded-2xl p-4 overflow-auto border border-surf-border dark:border-dk-border min-h-[600px] flex items-start justify-center">
              <div className="scale-[0.85] origin-top transform-gpu transition-transform">
                <FrontPagePreview data={form} templateId={template} id="front-page-preview" />
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
              Preview updates live as you type • A4 format • Front page always renders on white background
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
