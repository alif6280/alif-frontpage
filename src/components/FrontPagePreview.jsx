import React from 'react';

const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

/* ── Superscript helper ── */
const Sup = ({ text }) => {
  const parts = String(text).split(/(\d+(?:st|nd|rd|th))/gi);
  return (
    <span>
      {parts.map((part, i) => {
        const match = part.match(/^(\d+)(st|nd|rd|th)$/i);
        if (match) {
          return (
            <span key={i}>
              {match[1]}
              <sup style={{ fontSize: '0.65em', verticalAlign: 'super', lineHeight: 0 }}>
                {match[2]}
              </sup>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

/* ── Report title helper ── */
const getReportTitle = (data) => {
  if (data.reportNumberCustom) return data.reportNumberCustom;
  if (data.courseType === 'Lab') return 'Lab Report';
  if (data.courseType === 'Thesis') return 'Thesis';
  return `Assignment - ${data.reportNumber || '01'}`;
};

/* ══════════════════════════════════════════════════════════════════
   KYAU STYLE
══════════════════════════════════════════════════════════════════ */
const KYAUStyle = ({ data }) => (
  <div style={{
    fontFamily: 'Times New Roman, serif',
    padding: '52px 60px',
    minHeight: '842px',
    background: '#fff',
    color: '#111',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  }}>

    {/* Logo */}
    <div style={{ marginBottom: 10 }}>
      <img
        src={data.logoUrl || '/kyau-logo.png'}
        alt="logo"
        style={{ width: 92, height: 92, objectFit: 'contain' }}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>

    {/* University Name */}
    <h1 style={{
      fontSize: 20,
      fontWeight: 900,
      color: '#2d6a2d',
      textAlign: 'center',
      margin: '0 0 6px',
      lineHeight: 1.3,
    }}>
      {data.universityName || 'Khwaja Yunus Ali University'}
    </h1>

    {/* Report Title */}
    <h2 style={{
      fontSize: 18,
      fontWeight: 700,
      fontStyle: 'italic',
      color: '#1a3a6e',
      margin: '0 0 32px',
      textAlign: 'center',
    }}>
      {getReportTitle(data)}
    </h2>

    {/* Info Rows */}
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, marginBottom: 'auto' }}>
      <tbody>
        {[
          ['Name of the Department', data.department || 'Computer Science and Engineering'],
          ['Course Code',            data.courseCode  || '—'],
          ['Course Title',           data.courseTitle || '—'],
          ['Topic',                  data.topic       || '—'],
          ['Date of Submission',     data.submissionDate || today()],
        ].map(([label, value]) => (
          <tr key={label}>
            <td style={{ fontWeight: 700, width: '44%', paddingTop: 9, paddingBottom: 9, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
              {label}
            </td>
            <td style={{ paddingTop: 9, paddingBottom: 9, verticalAlign: 'top', paddingLeft: 12, wordBreak: 'break-word',fontWeight: 700, }}>
              :&nbsp;&nbsp;{value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Instructor Signature */}
    <div style={{ width: '100%', textAlign: 'center', marginTop: 40, marginBottom: 40 }}>
      <p style={{ fontSize: 12, color: '#333', margin: '0 0 3px', letterSpacing: '0.08em' }}>
        ..........................................
      </p>
      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
        Instructor Signature &amp; Date
      </p>
    </div>

    {/* Submitted By / To Table */}
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, border: '1px solid #bbb' }}>
      <thead>
        <tr>
          <th style={{ background: '#1a3a6e', color: '#fff', padding: '10px 18px', textAlign: 'left', fontWeight: 700, fontSize: 13, width: '50%', borderRight: '1px solid #fff' }}>
            Submitted by –
          </th>
          <th style={{ background: '#1a3a6e', color: '#fff', padding: '10px 18px', textAlign: 'left', fontWeight: 700, fontSize: 13 }}>
            Submitted to –
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '16px 18px', verticalAlign: 'top', borderRight: '1px solid #bbb' }}>
            <p style={{ fontWeight: 800, fontSize: 13, margin: '0 0 6px' }}>Name: {data.studentName || '—'}</p>
            <p style={{ margin: '0 0 4px' }}>ID Number: {data.studentId || '—'}</p>
            <p style={{ margin: '0 0 4px' }}>Batch No: <Sup text={`${data.batch || '—'}`} /></p>
            <p style={{ margin: '0 0 4px' }}>Semester: <Sup text={data.semester || '—'} /></p>
            <p style={{ margin: 0 }}>Khwaja Yunus Ali University</p>
          </td>
          <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
            <p style={{ fontWeight: 800, fontSize: 13, margin: '0 0 6px' }}>Name: {data.teacherName || '—'}</p>
            <p style={{ margin: '0 0 4px' }}>{data.designation || 'Lecturer & Program Co-ordinator'}</p>
            <p style={{ margin: '0 0 4px' }}>{data.teacherDepartment || 'Department of ' + (data.department || 'CSE')}</p>
            <p style={{ margin: 0 }}>Khwaja Yunus Ali University</p>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
);

/* ══════════════════════════════════════════════════════════════════
   MODERN CLEAN
══════════════════════════════════════════════════════════════════ */
const Row = ({ label, value }) => (
  <tr>
    <td style={{ fontWeight: 700, paddingRight: 12, whiteSpace: 'nowrap', paddingBottom: 6, paddingTop: 6, verticalAlign: 'top', width: '40%' }}>{label}</td>
    <td style={{ paddingBottom: 6, paddingTop: 6, verticalAlign: 'top' }}>: {value || '—'}</td>
  </tr>
);

const ModernClean = ({ data }) => (
  <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 0, minHeight: '842px', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div style={{ height: 6, background: 'linear-gradient(90deg,#1a3a6e,#5f77f9)' }} />
    <div style={{ padding: '44px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: '#1a3a6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>K</span>
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, margin: 0, color: '#1a3a6e' }}>{data.universityName || 'Khwaja Yunus Ali University'}</p>
          <p style={{ fontSize: 12, margin: 0, color: '#666' }}>Dept. of {data.department || 'CSE'}</p>
        </div>
      </div>
      <span style={{ display: 'inline-block', background: '#eef2ff', color: '#1a3a6e', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, marginBottom: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {getReportTitle(data)}
      </span>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111', margin: '0 0 8px', lineHeight: 1.3 }}>{data.topic || 'Topic'}</h2>
      <p style={{ fontSize: 12, color: '#888', margin: '0 0 36px' }}>{data.courseCode} · {data.courseTitle}</p>
      <div style={{ background: '#f6f8fc', borderRadius: 12, padding: '20px 24px', marginBottom: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <tbody>
            <Row label="Submitted To"    value={`${data.teacherName || '—'}, ${data.designation || '—'}`} />
            <Row label="Submitted By"    value={data.studentName || '—'} />
            <Row label="Student ID"      value={data.studentId || '—'} />
            <Row label="Batch"           value={data.batch || '—'} />
            <Row label="Semester"        value={data.semester || '—'} />
            <Row label="Submission Date" value={data.submissionDate || today()} />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   MINIMAL
══════════════════════════════════════════════════════════════════ */
const Minimal = ({ data }) => (
  <div style={{ fontFamily: 'Georgia, serif', padding: '60px 64px', minHeight: '842px', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div style={{ borderBottom: '0.5px solid #ccc', paddingBottom: 24, marginBottom: 32 }}>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', margin: '0 0 8px' }}>{data.universityName || 'Khwaja Yunus Ali University'}</p>
      <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#bbb', margin: 0 }}>Dept. of {data.department || 'CSE'}</p>
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 10, color: '#bbb', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 12px' }}>{getReportTitle(data)}</p>
      <h1 style={{ fontSize: 26, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.35 }}>{data.topic || 'Topic'}</h1>
      <p style={{ fontSize: 12, color: '#999', margin: '0 0 48px', fontStyle: 'italic' }}>{data.courseCode} — {data.courseTitle}</p>
      <div style={{ borderTop: '0.5px solid #eee', paddingTop: 24 }}>
        <table style={{ fontSize: 12, color: '#555', borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <Row label="Submitted To"     value={`${data.teacherName || '—'}, ${data.designation || '—'}`} />
            <Row label="Submitted By"     value={data.studentName || '—'} />
            <Row label="Student ID"       value={data.studentId || '—'} />
            <Row label="Batch / Semester" value={`${data.batch || '—'} · ${data.semester || '—'}`} />
            <Row label="Date"             value={data.submissionDate || today()} />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   DARK ACADEMIC
══════════════════════════════════════════════════════════════════ */
const DarkAcademic = ({ data }) => (
  <div style={{ fontFamily: 'Georgia, Times New Roman, serif', minHeight: '842px', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div style={{ background: '#0d1b3e', padding: '36px 52px', textAlign: 'center' }}>
      <p style={{ color: '#c9a84c', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 700 }}>{data.universityName || 'Khwaja Yunus Ali University'}</p>
      <p style={{ color: 'rgba(201,168,76,0.6)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>{data.teacherDepartment || 'Department of ' + (data.department || 'CSE')}</p>
    </div>
    <div style={{ padding: '36px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', margin: '0 0 10px' }}>{getReportTitle(data)}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.35 }}>{data.topic || 'Topic'}</h2>
      <p style={{ fontSize: 12, color: '#888', margin: '0 0 32px', fontStyle: 'italic' }}>{data.courseCode} · {data.courseTitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 'auto' }}>
        <div style={{ borderLeft: '3px solid #0d1b3e', paddingLeft: 16 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', margin: '0 0 8px' }}>Submitted To</p>
          <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px' }}>{data.teacherName || '—'}</p>
          <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{data.designation || '—'}</p>
        </div>
        <div style={{ borderLeft: '3px solid #c9a84c', paddingLeft: 16 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', margin: '0 0 8px' }}>Submitted By</p>
          <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px' }}>{data.studentName || '—'}</p>
          <p style={{ fontSize: 11, color: '#666', margin: '0 0 2px' }}>{data.studentId || '—'}</p>
          <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{data.batch} · {data.semester}</p>
        </div>
      </div>
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Date: {data.submissionDate || today()}</p>
        <p style={{ fontSize: 11, color: '#bbb', margin: 0 }}>{data.courseCode}</p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   COLORFUL
══════════════════════════════════════════════════════════════════ */
const Colorful = ({ data }) => (
  <div style={{ fontFamily: 'system-ui, Arial, sans-serif', minHeight: '842px', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div style={{ background: 'linear-gradient(135deg,#1a3a6e 0%,#2d6a9f 60%,#1a9f8a 100%)', padding: '40px 52px', textAlign: 'center' }}>
      <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 4px' }}>{data.universityName || 'Khwaja Yunus Ali University'}</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>Dept. of {data.department || 'CSE'}</p>
    </div>
    <div style={{ padding: '32px 52px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <span style={{ display: 'inline-block', background: '#e6faf7', color: '#1a9f8a', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, marginBottom: 14, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {getReportTitle(data)}
      </span>
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px', lineHeight: 1.3 }}>{data.topic || 'Topic'}</h2>
      <p style={{ fontSize: 12, color: '#888', margin: '0 0 28px' }}>{data.courseCode} · {data.courseTitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'auto' }}>
        {[
          ['Submitted To',     `${data.teacherName || '—'}\n${data.designation || '—'}`, '#eef2ff', '#1a3a6e'],
          ['Submitted By',     `${data.studentName || '—'}\nID: ${data.studentId || '—'}`, '#e6faf7', '#1a9f8a'],
          ['Batch / Semester', `${data.batch || '—'}\n${data.semester || '—'}`, '#fff8e6', '#a07830'],
          ['Submission Date',  data.submissionDate || today(), '#f0f4ff', '#5f77f9'],
        ].map(([lbl, val, bg, clr]) => (
          <div key={lbl} style={{ background: bg, borderRadius: 10, padding: '14px 16px', borderTop: `3px solid ${clr}` }}>
            <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: clr, margin: '0 0 6px' }}>{lbl}</p>
            {val.split('\n').map((l, i) => <p key={i} style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 400, margin: '0 0 1px', color: '#111' }}>{l}</p>)}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   THESIS STYLE
══════════════════════════════════════════════════════════════════ */
const ThesisStyle = ({ data }) => (
  <div style={{ fontFamily: 'Times New Roman, serif', padding: '56px 64px', minHeight: '842px', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
    <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #1a3a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      <span style={{ color: '#1a3a6e', fontSize: 24, fontWeight: 900 }}>K</span>
    </div>
    <h1 style={{ fontSize: 18, fontWeight: 900, color: '#1a3a6e', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>
      {data.universityName || 'Khwaja Yunus Ali University'}
    </h1>
    <p style={{ fontSize: 13, margin: '0 0 4px', color: '#444' }}>Department of {data.department || 'CSE'}</p>
    <p style={{ fontSize: 11, color: '#777', margin: '0 0 32px' }}>Enayetpur, Sirajganj-6751, Bangladesh</p>
    <div style={{ width: '80%', borderTop: '2px solid #1a3a6e', borderBottom: '2px solid #1a3a6e', padding: '20px 0', margin: '0 0 28px' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', margin: '0 0 8px' }}>{getReportTitle(data)}</p>
      <p style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', lineHeight: 1.35 }}>{data.topic || 'Title'}</p>
      <p style={{ fontSize: 12, color: '#888', margin: 0, fontStyle: 'italic' }}>{data.courseCode} · {data.courseTitle}</p>
    </div>
    <div style={{ width: '90%', textAlign: 'left', marginBottom: 'auto' }}>
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <tbody>
          <Row label="Submitted To"    value={`${data.teacherName || '—'}, ${data.designation || '—'}`} />
          <Row label="Submitted By"    value={data.studentName || '—'} />
          <Row label="Student ID"      value={data.studentId || '—'} />
          <Row label="Batch"           value={data.batch || '—'} />
          <Row label="Semester"        value={data.semester || '—'} />
          <Row label="Submission Date" value={data.submissionDate || today()} />
        </tbody>
      </table>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   Router
══════════════════════════════════════════════════════════════════ */
const TEMPLATES = { kyau: KYAUStyle, modern: ModernClean, minimal: Minimal, dark: DarkAcademic, colorful: Colorful, thesis: ThesisStyle };

export const FrontPagePreview = ({ data, templateId = 'kyau', id = 'front-page-preview' }) => {
  const Template = TEMPLATES[templateId] || KYAUStyle;
  return (
    <div id={id} style={{ width: '595px', minHeight: '842px', background: '#fff', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.12)', borderRadius: 8 }}>
      <Template data={data} />
    </div>
  );
};

export default FrontPagePreview;
