/**
 * Client-side PDF generation for documents.
 *
 * html2pdf.js bundles html2canvas + jsPDF and clocks in around 2.5 MB —
 * we dynamic-import it here so the route bundle only pays that cost when
 * the user actually asks to export.
 */

/** Print CSS — keeps contract §-structure, prevents split signatures, etc. */
const PDF_PRINT_CSS = `
/* Base typography */
h1, h2, h3, p, table { margin: 0; padding: 0; }
p { line-height: 1.65; }
strong { font-weight: 600; color: #1c1917; }
em { color: #78716c; font-style: italic; }
hr { border: none; border-top: 1px solid #e7e5e4; margin: 6mm 0; }
ul, ol { margin: 0 0 3mm 5mm; padding: 0; }
li { margin: 0 0 1.5mm 0; }
table { border-collapse: collapse; }

/* Contract Header — keep vermieter/mieter blocks intact */
.contract-header { margin-bottom: 8mm; padding-bottom: 6mm; border-bottom: 1px solid #e7e5e4; }
.contract-title { font-family: "Instrument Serif", Georgia, serif; font-size: 22pt; font-weight: 400; text-align: center; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 6mm; color: #1c1917; page-break-after: avoid; break-after: avoid; }
.contract-notice { background: #FFF9E6; border-left: 3px solid #C89F3E; padding: 3mm 4mm; margin-bottom: 8mm; font-size: 9.5pt; border-radius: 1mm; page-break-inside: avoid; break-inside: avoid; }
.contract-party-label { font-size: 9pt; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #78716c; margin-bottom: 2mm; page-break-after: avoid; break-after: avoid; }
.contract-party { padding-left: 4mm; border-left: 2px solid #e7e5e4; margin-bottom: 3mm; page-break-inside: avoid; break-inside: avoid; }
.contract-party p { margin: 0 0 1mm 0; }
.contract-party-meta { font-size: 9.5pt; color: #78716c; }
.contract-party-tag { text-align: center; font-size: 9.5pt; font-style: italic; color: #78716c; margin: 2mm 0 6mm 0; }
.contract-intro { text-align: center; font-weight: 600; padding-top: 4mm; margin-top: 4mm; border-top: 1px solid #e7e5e4; }

/* Contract Sections — uniform spacing shell. Sections may flow across pages,
   but the title + first paragraph form an indivisible "head" unit so a heading
   never sits orphaned at the bottom of a page. */
.contract-section { margin: 0 0 7mm 0; }
.contract-section-head { page-break-inside: avoid; break-inside: avoid; }
.contract-section-title { font-size: 12pt; font-weight: 600; color: #1c1917; letter-spacing: 0.01em; padding-bottom: 1.5mm; margin-bottom: 3mm; border-bottom: 1px solid #e7e5e4; page-break-after: avoid; break-after: avoid; }
.contract-section-body { font-size: 11pt; }
.contract-section-body p { margin: 0 0 3mm 0; page-break-inside: avoid; break-inside: avoid; }
.contract-section-body p:last-child { margin-bottom: 0; }
.contract-section-body table { width: 100%; margin: 3mm 0; page-break-inside: avoid; break-inside: avoid; }
.contract-section-body td { padding: 1.5mm 0; vertical-align: top; border: none; }
/* Two-column amount tables (Miete-Snippet etc.): right-align 2nd col, total row with top border */
.contract-section-body table tr td:last-child:not(:first-child) { text-align: right; }
.contract-section-body table tr:last-child td { border-top: 1px solid #e7e5e4; padding-top: 2mm; }
.contract-section-body table tr:last-child td > p { margin: 0; }

/* Contract Footer — signature block must never split */
.contract-footer { margin-top: 10mm; padding-top: 6mm; border-top: 1px solid #e7e5e4; page-break-inside: avoid; break-inside: avoid; }
.contract-date-line { margin-bottom: 14mm; }
.contract-date-sep { margin: 0 1mm; }
.contract-signatures { width: 100%; page-break-inside: avoid; }
.contract-signature-cell { width: 50%; vertical-align: top; padding: 0 4mm; }
.contract-signature-cell:first-child { padding-left: 0; }
.contract-signature-cell:last-child { padding-right: 0; }
.contract-signature-pad { min-height: 16mm; margin-bottom: -0.5mm; }
.contract-signature-pad img { max-height: 16mm; width: auto; }
.contract-signature-line { border-top: 1px solid #222; padding-top: 1.5mm; }
.contract-signature-role { font-weight: 600; font-size: 10.5pt; color: #1c1917; margin: 0; }
.contract-signature-name { font-size: 9.5pt; color: #78716c; margin: 0; }

/* Legacy fallbacks (non-contract docs still using plain h1/h2) */
h1:not(.contract-title) { font-family: "Instrument Serif", Georgia, serif; font-size: 22pt; font-weight: 400; margin: 0 0 5mm 0; color: #1c1917; letter-spacing: -0.01em; }
h2:not(.contract-section-title):not(.contract-title) { font-size: 12pt; font-weight: 600; margin: 7mm 0 2.5mm 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 1.5mm; color: #1c1917; }
h3 { font-size: 11pt; font-weight: 600; margin: 5mm 0 2mm 0; color: #1c1917; }
`

/** Page-break avoid selectors — keep these DOM nodes from splitting mid-print. */
const PDF_PAGEBREAK_AVOID = [
  '.contract-notice',
  '.contract-party',
  '.contract-footer',
  '.contract-section-head',
  '.contract-section-title',
  '.contract-section-body p',
  '.contract-section-body table',
  '.contract-signatures',
]

export interface GenerateDocumentPdfInput {
  /** Final HTML content of the document (sections already serialized if applicable). */
  html: string
  /** Used to derive the filename. Spaces become underscores. */
  filename: string
}

/** Generate and download a PDF from prepared HTML. Safe to call only in the browser. */
export async function generateDocumentPdf({ html, filename }: GenerateDocumentPdfInput): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('generateDocumentPdf must be called in the browser')
  }

  const html2pdf = (await import('html2pdf.js')).default

  const container = document.createElement('div')
  // No padding here — page margins are handled by html2pdf so they apply to
  // every page (incl. continuation pages), not just the first.
  container.style.cssText = 'width:170mm;font-family:"Geist Variable",Helvetica,Arial,sans-serif;font-size:11pt;line-height:1.65;color:#1c1917;background:#fff'
  container.innerHTML = html

  const style = document.createElement('style')
  style.textContent = PDF_PRINT_CSS
  container.prepend(style)
  document.body.appendChild(container)

  try {
    const safeFilename = `${filename.replace(/\s+/g, '_')}.pdf`
    // html2pdf.js typings are incomplete: `pagebreak` is unlisted and the
    // chain return type is wrong. Cast the chain entry to `any` once so the
    // fluent API stays readable.
    await (html2pdf() as any).set({
      // [top, left, bottom, right] in mm — A4 = 210×297mm. Top a touch larger
      // for breathing room above the heading on every page.
      margin: [22, 20, 20, 20],
      filename: safeFilename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: PDF_PAGEBREAK_AVOID,
      },
    }).from(container).save()
  } finally {
    container.remove()
  }
}

/** Replace `<div data-signature="…">` markers with embedded signature images. */
export function embedSignaturesInHtml(html: string, signatures: Record<string, string>): string {
  if (typeof window === 'undefined') return html
  const dom = new DOMParser().parseFromString(html, 'text/html')
  Object.entries(signatures).forEach(([key, dataUrl]) => {
    dom.querySelectorAll(`[data-signature="${key}"]`).forEach(el => {
      el.innerHTML = `<img src="${dataUrl}" alt="Unterschrift ${key}" style="max-height:56px;max-width:200px;display:block;margin:0;" />`
    })
  })
  return dom.body.innerHTML
}
