import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Download, FileText, Printer, RotateCcw, Search, ChevronDown, Pencil, Layers, Upload, FileText as FileIcon, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Select, Badge } from '../components/ui';
import { FrontPagePreview } from '../components/FrontPagePreview';
import { exportToPDF, exportToDOCX } from '../lib/export';
import { SEMESTERS, BATCHES, TEMPLATES, DEPARTMENTS, getCoursesBySemester, searchCoursesLocal } from '../data/courses';
import { saveHistory } from '../lib/supabase';
import clsx from 'clsx';

const BADGE_MAP = { Theory: 'theory', Lab: 'lab', Project: 'project' };
const ASSIGNMENT_NUMBERS = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0'));

const REPORT_TYPES = [
  { id: 'Assignment', label: 'Assignment', icon: '📝' },
  { id: 'Lab',        label: 'Lab Report', icon: '🔬' },
  { id: 'Thesis',     label: 'Thesis',     icon: '📚' },
];

const ReportTypePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {REPORT_TYPES.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)}
        className={clsx('flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-xs font-semibold transition-all',
          value === t.id
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-500'
            : 'border-surf-border dark:border-dk-border text-gray-500 dark:text-slate-400 hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2')}>
        <span className="text-lg">{t.icon}</span>{t.label}
      </button>
    ))}
  </div>
);

const TemplatePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-2">
    {TEMPLATES.map(tpl => (
      <button key={tpl.id} onClick={() => onChange(tpl.id)}
        className={clsx('text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all',
          value === tpl.id
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-500'
            : 'border-surf-border dark:border-dk-border text-gray-500 dark:text-slate-400 hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2')}>
        <Layers size={13} className="mb-1" />{tpl.name}
      </button>
    ))}
  </div>
);

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
      <p className="text-xs font-semibold text-gray-600 dark:text-slate-400">University Logo</p>
      <div onClick={() => inputRef.current?.click()}
        className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all',
          value ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
            : 'border-surf-border dark:border-dk-border hover:border-brand-300 hover:bg-surf-2 dark:hover:bg-dk-card2')}>
        {value ? (
          <><img src={value} alt="logo" className="w-10 h-10 object-contain rounded-full border border-gray-200" />
            <div className="flex-1"><p className="text-xs font-semibold text-brand-500">Logo uploaded ✓</p><p className="text-xs text-gray-400">Click to change</p></div></>
        ) : (
          <><div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dk-card2 flex items-center justify-center"><Upload size={16} className="text-gray-400" /></div>
            <div><p className="text-xs font-semibold text-gray-600 dark:text-slate-400">Upload Logo</p><p className="text-xs text-gray-400">PNG, JPG supported</p></div></>
        )}
      </div>
      {value && <button onClick={() => onChange('')} className="text-xs text-red-400 hover:text-red-500 transition-colors">Remove logo</button>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

const CourseSearch = ({ semester, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const handleSearch = (q) => { setQuery(q); setResults(q.length < 1 ? getCoursesBySemester(semester) : searchCoursesLocal(q)); setOpen(true); };
  const handleFocus = () => { setResults(getCoursesBySemester(semester)); setOpen(true); };
  const pick = (c) => { onSelect(c); setQuery(`${c.code} — ${c.title}`); setOpen(false); };
  return (
    <div className="relative" ref={ref}>
      <Input label="Course" placeholder="Search by name or code…" value={query}
        onChange={e => handleSearch(e.target.value)} onFocus={handleFocus}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        icon={<Search size={15} />} suffix={<ChevronDown size={13} className={clsx('transition-transform', open && 'rotate-180')} />} />
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full bg-white dark:bg-dk-card rounded-xl border border-surf-border dark:border-dk-border shadow-hover max-h-52 overflow-y-auto animate-fade-in">
          {results.map(c => (
            <button key={c.code} onMouseDown={() => pick(c)}
              className="w-full text-left px-4 py-2.5 hover:bg-surf-2 dark:hover:bg-dk-card2 transition-colors flex items-center justify-between gap-3">
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

const EditableInput = ({ label, ...props }) => (
  <Input label={label} suffix={<Pencil size={12} className="text-gray-300" />} {...props} />
);

/* ── Section card wrapper ── */
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-dk-card rounded-2xl border border-surf-border dark:border-dk-border shadow-card p-4 sm:p-5 space-y-4">
    {title && (
      <h3 className="text-sm font-bold text-gray-700 dark:text-white flex items-center gap-2">
        {Icon && <Icon size={15} className="text-brand-500" />} {title}
      </h3>
    )}
    {children}
  </div>
);

export const GeneratorPage = () => {
  const { profile, user } = useAuth();
  const [template, setTemplate] = useState('kyau');
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // mobile preview toggle

  const defaultForm = useCallback(() => ({
    universityName:      profile?.university_name || 'Khwaja Yunus Ali University',
    department:          profile?.department      || 'Computer Science and Engineering',
    semester:            profile?.semester        || '1st Year 1st Semester',
    courseCode:          '',
    courseTitle:         '',
    courseType:          'Assignment',
    reportNumber:        '01',
    reportNumberCustom:  '',
    teacherName:         '',
    designation:         '',
    studentName:         profile?.full_name  || '',
    studentId:           profile?.student_id || '',
    batch:               (profile?.batch || '').replace(' Batch', '') || '1st',
    topic:               '',
    submissionDate:      (() => { const d = new Date(); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`; })(),
    logoUrl:             '',
    teacherDepartment:   'Department of CSE',
  }), [profile]);

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        universityName: profile.university_name || 'Khwaja Yunus Ali University',
        department:     profile.department      || 'Computer Science and Engineering',
        semester:       profile.semester        || '1st Year 1st Semester',
        studentName:    profile.full_name       || '',
        studentId:      profile.student_id      || '',
        batch:          (profile.batch || '').replace(' Batch', '') || '1st',
      }));
    }
  }, [profile]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: typeof e === 'string' ? e : e.target.value }));

  const onCourseSelect = (c) => {
    setForm(f => ({ ...f, courseCode: c.code, courseTitle: c.title, courseType: c.type || f.courseType, teacherName: c.teacher?.name || '', designation: c.teacher?.designation || '' }));
  };

  const handleReset = () => { setForm(defaultForm()); toast('Fields reset to your profile info.'); };

  const handlePDF = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setExporting(true);
    try {
      await exportToPDF('front-page-preview', `${form.topic.replace(/\s+/g, '-')}-front-page.pdf`);
      try {
        const result = await saveHistory({ ...form, template_id: template, user_id: user?.id });
        if (result.error) toast.error('History save failed: ' + result.error.message);
      } catch (e) { toast.error('History error: ' + e.message); }
      toast.success('PDF downloaded!');
    } catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  const handleDOCX = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setExporting(true);
    try { await exportToDOCX(form); toast.success('DOCX downloaded!'); }
    catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  const handlePrint = () => {
    const el = document.getElementById('front-page-preview');
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><style>body{margin:0;padding:0;}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style></head><body>${el.outerHTML}</body></html>`);
    w.document.close(); w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-surf-2 dark:bg-dk-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-4 sm:mb-5 gap-2">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight">Front Page Generator</h1>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-400 mt-0.5 truncate">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(' ')[0]}` : 'Fill in the details'} — auto-filled from your profile.
            </p>
          </div>
          <button onClick={handleReset}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-brand-500 dark:text-brand-300 hover:text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* ── Mobile: Export + Preview toggle bar ── */}
        <div className="lg:hidden mb-4 flex items-center gap-2 flex-wrap">
          <Button variant="primary"   size="sm" icon={<Download size={14} />} onClick={handlePDF}   loading={exporting}>PDF</Button>
          <Button variant="secondary" size="sm" icon={<FileText size={14} />} onClick={handleDOCX}  loading={exporting}>DOCX</Button>
          <Button variant="ghost"     size="sm" icon={<Printer size={14} />}  onClick={handlePrint}>Print</Button>
          <button
            onClick={() => setShowPreview(s => !s)}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-surf-border dark:border-dk-border text-gray-600 dark:text-slate-300 bg-white dark:bg-dk-card transition-all">
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* ── Mobile Preview (collapsible) ── */}
        {showPreview && (
          <div className="lg:hidden mb-4 bg-gray-100 dark:bg-dk-card2 rounded-2xl p-3 overflow-auto border border-surf-border dark:border-dk-border">
            <div className="origin-top-left transform-gpu" style={{ 
  transform: `scale(${window.innerWidth / 595})`,
  width: `${595}px`,
  transformOrigin: 'top left'
}}>
              <FrontPagePreview data={form} templateId={template} id="front-page-preview-mobile" />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[420px_1fr] gap-4 sm:gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="space-y-4 sm:space-y-5">

            {/* 1. Report Type */}
            <Section title="Report Type" icon={FileIcon}>
              <ReportTypePicker value={form.courseType} onChange={(v) => setForm(f => ({ ...f, courseType: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label={form.courseType === 'Lab' ? 'Lab Report No.' : form.courseType === 'Thesis' ? 'Thesis No.' : 'Assignment No.'}
                  value={form.reportNumber} onChange={set('reportNumber')}>
                  {ASSIGNMENT_NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                </Select>
                <EditableInput
                  label="Custom Title (optional)"
                  value={form.reportNumberCustom || ''}
                  onChange={set('reportNumberCustom')}
                  placeholder="e.g. Assignment - 01"
                />
              </div>
            </Section>

            {/* 2. University */}
            <Section title="University">
              <LogoUploader value={form.logoUrl} onChange={(v) => setForm(f => ({ ...f, logoUrl: v }))} />
              <EditableInput label="University Name" value={form.universityName} onChange={set('universityName')} />
              <Select label="Department" value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                <option value="Other">Other</option>
              </Select>
              <Select label="Semester" value={form.semester} onChange={set('semester')}>
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Section>

            {/* 3. Course */}
            <Section title="Course Details">
              <CourseSearch semester={form.semester} onSelect={onCourseSelect} />
              <EditableInput label="Course Code"  value={form.courseCode}  onChange={set('courseCode')}  placeholder="e.g. CSE 2202" />
              <EditableInput label="Course Title" value={form.courseTitle} onChange={set('courseTitle')} placeholder="Course Title" />
              <Input label="Topic / Title"    value={form.topic}           onChange={set('topic')}           placeholder="Type your assignment topic…" />
              <Input label="Submission Date"  value={form.submissionDate}  onChange={set('submissionDate')}  placeholder="DD/MM/YYYY" />
            </Section>

            {/* 4. Teacher */}
            <Section title="Teacher">
              <EditableInput label="Teacher Name"  value={form.teacherName}  onChange={set('teacherName')}  placeholder="Auto-filled from course" />
              <EditableInput label="Designation"   value={form.designation}  onChange={set('designation')}  placeholder="Auto-filled from course" />
              <Select label="Teacher Department" value={form.teacherDepartment} onChange={set('teacherDepartment')}>
                {['Department of CSE','Department of EEE','Department of BBA','Department of Law','Department of Pharmacy','Department of English','Department of Mathematics','Department of Physics','Department of Statistics','Department of Economics','Department of Humanities'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </Section>

            {/* 5. Student */}
            <Section title="Student Details">
              <div className="flex items-center justify-between -mt-1">
                <span className="text-xs text-gray-400 dark:text-slate-500 italic">Editable (session-only)</span>
              </div>
              <EditableInput label="Student Name" value={form.studentName} onChange={set('studentName')} />
              <EditableInput label="Student ID"   value={form.studentId}   onChange={set('studentId')} />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Batch" value={form.batch} onChange={set('batch')}>
                  {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
                <Select label="Semester" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </Section>

            {/* 6. Template */}
            <Section title="Template Style" icon={Layers}>
              <TemplatePicker value={template} onChange={setTemplate} />
            </Section>

          </div>

          {/* ── RIGHT: Preview (desktop only) ── */}
          <div className="hidden lg:block sticky top-[76px]">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button variant="primary"   size="sm" icon={<Download size={14} />} onClick={handlePDF}   loading={exporting}>Download PDF</Button>
              <Button variant="secondary" size="sm" icon={<FileText size={14} />} onClick={handleDOCX}  loading={exporting}>Download DOCX</Button>
              <Button variant="ghost"     size="sm" icon={<Printer size={14} />}  onClick={handlePrint}>Print</Button>
            </div>
            <div className="bg-gray-100 dark:bg-dk-card2 rounded-2xl p-4 overflow-auto border border-surf-border dark:border-dk-border min-h-[600px] flex items-start justify-center">
              <div className="scale-[0.85] origin-top transform-gpu transition-transform">
                <FrontPagePreview data={form} templateId={template} id="front-page-preview" />
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-3">
              Preview updates live as you type • A4 format • Front page always renders on white background
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
