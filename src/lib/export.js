import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export the front-page preview element to PDF (A4).
 * @param {string} elementId  - id of the DOM element to capture
 * @param {string} filename   - output filename
 * @param {'normal'|'high'} quality
 */
export const exportToPDF = async (elementId = 'front-page-preview', filename = 'front-page.pdf', quality = 'normal') => {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Preview element not found');

  const scale = quality === 'high' ? 3 : 2;

  // Clone at true A4 size so html2canvas doesn't squish text together
  const clone = el.cloneNode(true);
  clone.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:595px;min-height:842px;transform:none;zoom:1;overflow:visible;box-shadow:none;border-radius:0;background:#fff;';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 595,
      windowWidth: 595,
    });

    const imgData = canvas.toDataURL('image/jpeg', quality === 'high' ? 1.0 : 0.93);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, W, H);
    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
};

/**
 * Export front-page data to a .docx Word document.
 */
export const exportToDOCX = async (formData) => {
  const {
    Document, Packer, Paragraph, TextRun, AlignmentType,
    Table, TableRow, TableCell, WidthType, BorderStyle,
  } = await import('docx');

  const {
    universityName, department, courseCode, courseTitle, courseType,
    teacherName, designation, studentName, studentId,
    batch, semester, topic, submissionDate,
  } = formData;

  const noBorder = { top:{style:BorderStyle.NONE,size:0}, bottom:{style:BorderStyle.NONE,size:0}, left:{style:BorderStyle.NONE,size:0}, right:{style:BorderStyle.NONE,size:0} };

  const infoRow = (label, value) => new TableRow({
    children: [
      new TableCell({ borders:noBorder, width:{size:40,type:WidthType.PERCENTAGE}, children:[new Paragraph({ children:[new TextRun({ text:label, bold:true, size:22 })] })] }),
      new TableCell({ borders:noBorder, width:{size:5,type:WidthType.PERCENTAGE},  children:[new Paragraph({ children:[new TextRun({ text:':', bold:true, size:22 })] })] }),
      new TableCell({ borders:noBorder, width:{size:55,type:WidthType.PERCENTAGE}, children:[new Paragraph({ children:[new TextRun({ text: value || '—', size:22 })] })] }),
    ]
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:100}, children:[new TextRun({ text: universityName || 'Khwaja Yunus Ali University', bold:true, size:32, color:'1a3a6e' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:60},  children:[new TextRun({ text: `Department of ${department||'Computer Science and Engineering'}`, size:24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:400}, children:[new TextRun({ text: 'Enayetpur, Sirajganj-6751, Bangladesh', size:20, color:'666666' })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{before:200,after:200}, children:[new TextRun({ text: courseType === 'Lab' ? 'Lab Report' : 'Assignment', bold:true, size:28, color:'1a3a6e', allCaps:true })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:100}, children:[new TextRun({ text: 'Topic:', bold:true, size:22, color:'888888' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing:{after:400}, children:[new TextRun({ text: topic || 'Assignment Topic', bold:true, size:28, color:'111111' })] }),

        new Table({
          width: { size:100, type:WidthType.PERCENTAGE },
          rows: [
            infoRow('Submitted To',    `${teacherName||'—'}, ${designation||'—'}`),
            infoRow('Department',      department || '—'),
            infoRow('Submitted By',    studentName || '—'),
            infoRow('Student ID',      studentId || '—'),
            infoRow('Batch',           batch || '—'),
            infoRow('Semester',        semester || '—'),
            infoRow('Course Code',     courseCode || '—'),
            infoRow('Course Title',    courseTitle || '—'),
            infoRow('Submission Date', submissionDate || new Date().toLocaleDateString('en-GB')),
          ]
        }),
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(topic || 'assignment').replace(/\s+/g, '-').toLowerCase()}-front-page.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
