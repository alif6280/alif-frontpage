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

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.054 23.902a.5.5 0 0 0 .615.612l6.094-1.51A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.523-5.183-1.432l-.362-.217-3.761.932.977-3.696-.236-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

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
  const [template,    setTemplate]    = useState('kyau');
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [waLoading,   setWaLoading]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    setPdfLoading(true);
    try {
      await exportToPDF('front-page-preview', `${form.topic.replace(/\s+/g, '-')}-front-page.pdf`);
      try {
        const result = await saveHistory({ ...form, template_id: template, user_id: user?.id });
        if (result.error) toast.error('History save failed: ' + result.error.message);
      } catch (e) { toast.error('History error: ' + e.message); }
      toast.success('PDF downloaded!');
    } catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setPdfLoading(false); }
  };

  const handleDOCX = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setDocxLoading(true);
    try { await exportToDOCX(form); toast.success('DOCX downloaded!'); }
    catch (e) { toast.error('Export failed: ' + e.message); }
    finally { setDocxLoading(false); }
  };

  const handlePrint = () => {
    const el = document.getElementById('front-page-preview');
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><style>body{margin:0;padding:0;}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style></head><body>${el.outerHTML}</body></html>`);
    w.document.close(); w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  const handleWhatsApp = async () => {
    if (!form.topic) { toast.error('Please enter a topic first.'); return; }
    setWaLoading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF }       = await import('jspdf');

      const el = document.getElementById('front-page-preview');
      if (!el) throw new Error('Preview not found');

      const clone = el.cloneNode(true);
      clone.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:595px;min-height:842px;transform:none;zoom:1;overflow:visible;box-shadow:none;border-radius:0;background:#fff;';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false, width: 595, windowWidth: 595,
      });
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/jpeg', 0.93);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

      const pdfBlob = pdf.output('blob');
      const fileName = `${form.topic.replace(/\s+/g, '-')}-front-page.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `${form.topic} - Front Page` });
        toast.success('Shared!');
      } else {
        // Desktop fallback — download PDF
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('PDF downloaded! Share it manually on WhatsApp.', { icon: '📥' });
      }
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setWaLoading(false);
    }
  };

  const ActionButtons = ({ mobile }) => (
    <div className={clsx('flex items-center gap-2 flex-wrap', !mobile && 'mb-4')}>
      <Button variant="primary"   size="sm" icon={<Download size={14} />} onClick={handlePDF}   loading={pdfLoading}>
        {mobile ? 'PDF' : 'Download PDF'}
      </Button>
      <Button variant="secondary" size="sm" icon={<FileText size={14} />} onClick={handleDOCX}  loading={docxLoading}>
        {mobile ? 'DOCX' : 'Download DOCX'}
      </Button>
      <Button variant="ghost"     size="sm" icon={<Printer size={14} />}  onClick={handlePrint}>
        Print
      </Button>
      <button onClick={handleWhatsApp} disabled={waLoading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white transition-all">
        {waLoading
          ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          : <WhatsAppIcon />}
        {waLoading ? '...' : 'Share'}
      </button>
      {mobile && (
        <button onClick={() => setShowPreview(s => !s)}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-surf-border dark:border-dk-border text-gray-600 dark:text-slate-300 bg-white dark:bg-dk-card transition-all">
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPreview ? 'Hide' : 'Preview'}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-56px)] bg-surf-2 dark:bg-dk-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

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

        <div className="lg:hidden mb-4">
          <ActionButtons mobile />
        </div>

        {showPreview && (
          <div className="lg:hidden mb-4 bg-gray-100 dark:bg-dk-card2 rounded-2xl p-3 overflow-hidden border border-surf-border dark:border-dk-border">
            <div style={{
              transform: `scale(${(window.innerWidth - 48) / 595})`,
              width: '595px',
              transformOrigin: 'top left',
            }}>
              <FrontPagePreview data={form} templateId={template} id="front-page-preview-mobile" />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[420px_1fr] gap-4 sm:gap-6 items-start">

          <div className="space-y-4 sm:space-y-5">

            <Section title="Report Type" icon={FileIcon}>
              <ReportTypePicker value={form.courseType} onChange={(v) => setForm(f => ({ ...f, courseType: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label={form.courseType === 'Lab' ? 'Lab Report No.' : form.courseType === 'Thesis' ? 'Thesis No.' : 'Assignment No.'}
                  value={form.reportNumber} onChange={set('reportNumber')}>
                  {ASSIGNMENT_NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                </Select>
                <EditableInput label="Custom Title (optional)" value={form.reportNumberCustom || ''} onChange={set('reportNumberCustom')} placeholder="e.g. Assignment - 01" />
              </div>
            </Section>

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

            <Section title="Course Details">
              <CourseSearch semester={form.semester} onSelect={onCourseSelect} />
              <EditableInput label="Course Code"  value={form.courseCode}  onChange={set('courseCode')}  placeholder="e.g. CSE 2202" />
              <EditableInput label="Course Title" value={form.courseTitle} onChange={set('courseTitle')} placeholder="Course Title" />
              <Input label="Topic / Title"   value={form.topic}          onChange={set('topic')}          placeholder="Type your assignment topic…" />
              <Input label="Submission Date" value={form.submissionDate} onChange={set('submissionDate')} placeholder="DD/MM/YYYY" />
            </Section>

            <Section title="Teacher">
              <EditableInput label="Teacher Name" value={form.teacherName} onChange={set('teacherName')} placeholder="Auto-filled from course" />
              <EditableInput label="Designation"  value={form.designation} onChange={set('designation')}  placeholder="Auto-filled from course" />
              <Select label="Teacher Department" value={form.teacherDepartment} onChange={set('teacherDepartment')}>
                {['Department of CSE','Department of EEE','Department of BBA','Department of Law','Department of Pharmacy','Department of English','Department of Mathematics','Department of Physics','Department of Statistics','Department of Economics','Department of Humanities'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </Section>

            <Section title="Student Details">
              <span className="text-xs text-gray-400 dark:text-slate-500 italic -mt-1 block">Editable (session-only)</span>
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

            <Section title="Template Style" icon={Layers}>
              <TemplatePicker value={template} onChange={setTemplate} />
            </Section>

          </div>

          <div className="hidden lg:block sticky top-[76px]">
            <ActionButtons mobile={false} />
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