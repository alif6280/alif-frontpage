import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/* ── shared canvas helper ─────────────────────────────────────── */
const capturePreview = async () => {
  const el = document.getElementById('front-page-preview');
  if (!el) throw new Error('Preview element not found');

  const clone = el.cloneNode(true);
  clone.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:595px;min-height:842px;' +
    'transform:none;zoom:1;overflow:visible;box-shadow:none;border-radius:0;background:#fff;';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 595,
      windowWidth: 595,
    });
    return canvas;
  } finally {
    document.body.removeChild(clone);
  }
};

/* ── PDF export ───────────────────────────────────────────────── */
export const exportToPDF = async (elementId = 'front-page-preview', filename = 'front-page.pdf') => {
  const canvas  = await capturePreview();
  const imgData = canvas.toDataURL('image/jpeg', 0.93);
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'JPEG', 0, 0, W, H);
  pdf.save(filename);
};

/* ── DOCX export ─────────────────────────────────────────────── */
export const exportToDOCX = async (formData) => {
  const { Document, Packer, Paragraph, ImageRun, AlignmentType } = await import('docx');

  const canvas = await capturePreview();

  // canvas is scale:2 so actual content px = canvas.width/2 = 595, canvas.height/2 = actual height
  const actualHeightPx = canvas.height / 2; // real content height in px

  // A4 width in points = 595pt
  // Scale height proportionally: (actualHeightPx / 595) * 595 = actualHeightPx pt
  const imgW = 595;
  const imgH = Math.round(actualHeightPx);

  // A4 page height in twips: 595pt * 20 = 11900 twips width, imgH * 20 height
  const pageWidthTwips  = 11906; // 210mm
  const pageHeightTwips = imgH * 20; // exact content height

  const base64 = canvas.toDataURL('image/png').split(',')[1];
  const bytes  = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size:   { width: pageWidthTwips, height: pageHeightTwips },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 0, line: 240 },
          children: [
            new ImageRun({
              data: bytes,
              transformation: { width: imgW, height: imgH },
              type: 'png',
            }),
          ],
        }),
      ],
    }],
  });

  const outBlob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(outBlob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `${(formData.topic || 'assignment').replace(/\s+/g, '-').toLowerCase()}-front-page.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};