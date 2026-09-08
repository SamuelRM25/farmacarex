import type { QuoteItem, ClienteInfo, MedicoInfo, SavedQuote } from '../types';
import { MEDICATION_BY_ID } from '../data/medications';
import { PRICES } from '../data/prices';
import { formatGTQ } from './currency';

const COLORS = {
  red: [230, 57, 70] as [number, number, number],
  blue: [30, 77, 139] as [number, number, number],
  gray: [240, 244, 248] as [number, number, number],
  darkGray: [60, 70, 90] as [number, number, number],
};

function unitPrice(medId: string, tier: 'diez' | 'medico'): number {
  const p = PRICES[medId];
  if (!p) return 0;
  if (tier === 'medico') return p.medico;
  return p.diezOMas ?? p.medico;
}

function tierLabel(tier: 'diez' | 'medico'): string {
  return tier === 'medico' ? 'Médico' : '10+';
}

function sanitizeFilename(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'cliente';
}

export async function generateQuotePDF(opts: {
  cliente: ClienteInfo;
  medico: MedicoInfo;
  items: QuoteItem[];
  notas: string;
  fecha: string;
  total: number;
  numero?: string;
}): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  let cursorY = 14;

  doc.setFillColor(...COLORS.blue);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Droguería FarmaCarex, S.A.', marginX, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Cotización profesional', marginX, 21);
  doc.setFontSize(9);
  doc.text('Tel: (+502) 2433-5641   ·   2 av. 11-30 Col. San Francisco II, zona 6 de Mixco, Guatemala', marginX, 25);

  cursorY = 36;

  doc.setTextColor(...COLORS.darkGray);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('COTIZACIÓN', marginX, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const numLabel = opts.numero ? `No. ${opts.numero}` : 'Pre-orden';
  doc.text(numLabel, pageWidth - marginX, cursorY, { align: 'right' });
  cursorY += 4;
  doc.text(`Fecha: ${opts.fecha}`, pageWidth - marginX, cursorY, { align: 'right' });
  cursorY += 8;

  // Client block
  doc.setFillColor(...COLORS.gray);
  doc.rect(marginX, cursorY, pageWidth - 2 * marginX, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.blue);
  doc.text('CLIENTE / MÉDICO', marginX + 3, cursorY + 5);
  doc.setTextColor(...COLORS.darkGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const lineY = cursorY + 10;
  doc.text(`Cliente: ${opts.cliente.nombre || '—'}`, marginX + 3, lineY);
  doc.text(`Tel: ${opts.cliente.telefono || '—'}`, marginX + 80, lineY);
  doc.text(`Dirección: ${opts.cliente.direccion || '—'}`, marginX + 3, lineY + 5);
  doc.text(`Médico: ${opts.medico.nombre || '—'}`, marginX + 3, lineY + 10);
  doc.text(`Colegiado: ${opts.medico.colegiado || '—'}   ·   Esp: ${opts.medico.especialidad || '—'}`, marginX + 80, lineY + 10);
  cursorY += 30;

  // Items table
  const rows = opts.items.map((it, idx) => {
    const med = MEDICATION_BY_ID[it.medId];
    const unit = unitPrice(it.medId, it.tier);
    const subtotal = unit * it.qty;
    return [
      String(idx + 1),
      med ? med.nombreComercial : it.medId,
      med ? med.presentacion : '—',
      tierLabel(it.tier),
      String(it.qty),
      formatGTQ(unit),
      formatGTQ(subtotal),
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    head: [['#', 'Producto', 'Presentación', 'Nivel', 'Cant.', 'Precio unit.', 'Subtotal']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: COLORS.blue, textColor: 255, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: COLORS.darkGray, cellPadding: 3 },
    alternateRowStyles: { fillColor: [249, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 36 },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 24, halign: 'right' },
    },
    margin: { left: marginX, right: marginX },
  });

  cursorY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.red);
  doc.text('TOTAL', pageWidth - marginX - 50, cursorY + 6, { align: 'left' });
  doc.setTextColor(...COLORS.darkGray);
  doc.text(formatGTQ(opts.total), pageWidth - marginX, cursorY + 6, { align: 'right' });

  cursorY += 16;

  // Notas
  if (opts.notas) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.blue);
    doc.text('NOTAS', marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.darkGray);
    const lines = doc.splitTextToSize(opts.notas, pageWidth - 2 * marginX);
    doc.text(lines, marginX, cursorY + 5);
    cursorY += 5 + lines.length * 4 + 4;
  }

  // Terms
  doc.setDrawColor(...COLORS.blue);
  doc.setLineWidth(0.4);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.blue);
  doc.text('TÉRMINOS Y CONDICIONES', marginX, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.darkGray);
  const terms = [
    '• Esta cotización no constituye factura. Sujeto a disponibilidad de inventario.',
    '• Precios en Quetzales (GTQ) e incluyen IVA cuando aplique.',
    '• Validez de la oferta: 15 días calendario a partir de la fecha de emisión.',
    '• Forma de pago: según acuerdo comercial. Entregas a coordinar con el agente de ventas.',
    '• Receta médica obligatoria para antibióticos y antihipertensivos según normativa MSPAS Guatemala.',
  ];
  doc.text(terms, marginX, cursorY + 5);
  cursorY += 5 + terms.length * 4 + 6;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(140, 145, 160);
  doc.text(
    'Generado por FarmaCarex — Vademécum y Cotizador · www.farmacarex.com',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 8,
    { align: 'center' }
  );

  const filename = `Cotizacion-FarmaCarex-${sanitizeFilename(opts.cliente.nombre)}-${opts.fecha}.pdf`;
  doc.save(filename);
}

export async function generateSavedQuotePDF(quote: SavedQuote, numero?: string): Promise<void> {
  return generateQuotePDF({
    cliente: quote.cliente,
    medico: quote.medico,
    items: quote.items,
    notas: quote.notas,
    fecha: quote.fecha,
    total: quote.total,
    numero: numero ?? quote.id.slice(0, 8).toUpperCase(),
  });
}
