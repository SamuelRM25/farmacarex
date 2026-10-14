import type { QuoteItem, ClienteInfo, MedicoInfo } from '../types';
import { MEDICATION_BY_ID } from '../data/medications';
import { PRICES } from '../data/prices';
import { unitPriceForTier } from './pricing';

const PHONE_REGEX = /[^0-9+]/g;

function sanitizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(PHONE_REGEX, '');
}

export function computeTotal(items: QuoteItem[]): number {
  return items.reduce((acc, it) => acc + unitPriceForTier(PRICES[it.medId], it.tier) * it.qty, 0);
}

function money(value: number): string {
  return `Q ${value.toFixed(2)}`;
}

function escapeAsterisks(s: string): string {
  // WhatsApp usa *asterisco* para bold. Si un nombre de producto tiene
  // asteriscos, los escapamos con zero-width-joiner para que no rompa el formato.
  return s.replace(/\*/g, '\u200d*');
}

export function buildWhatsappText(opts: {
  cliente: ClienteInfo;
  medico: MedicoInfo;
  items: QuoteItem[];
  total: number;
  fecha: string;
}): string {
  const lines: string[] = [];
  lines.push('Hola,');
  if (opts.medico.nombre) lines.push(`Dr./Dra. ${escapeAsterisks(opts.medico.nombre)},`);
  lines.push('');
  lines.push('Adjunto la cotización de FarmaCarex:');
  lines.push('');

  // Cada item: nombre + presentacion en una línea, debajo cantidad ×
  // unitario y subtotal. Total general separado con línea de puntos.
  opts.items.forEach((it) => {
    const med = MEDICATION_BY_ID[it.medId];
    const unit = unitPriceForTier(PRICES[it.medId], it.tier);
    const subtotal = unit * it.qty;
    const name = med ? escapeAsterisks(med.nombreComercial) : it.medId;
    const presentacion = med ? escapeAsterisks(med.presentacion) : '';
    lines.push(`• *${name}*${presentacion ? ` _(${presentacion})_` : ''}`);
    lines.push(`   ${it.qty} × ${money(unit)} c/u · = ${money(subtotal)}`);
  });

  lines.push('');
  lines.push(`• *TOTAL: ${money(opts.total)}*`);
  lines.push('');
  if (opts.cliente.nombre) lines.push(`Cliente: ${escapeAsterisks(opts.cliente.nombre)}`);
  lines.push(`Fecha: ${opts.fecha}`);
  lines.push('Válida por 15 días calendario. Sujeto a disponibilidad.');
  lines.push('');
  lines.push('Quedo atento a su confirmación. ¡Gracias!');
  lines.push('');
  lines.push('— Droguería FarmaCarex, S.A.');

  return encodeURIComponent(lines.join('\n'));
}

export function buildWhatsappLink(opts: {
  cliente: ClienteInfo;
  medico: MedicoInfo;
  items: QuoteItem[];
  total: number;
  fecha: string;
}): string {
  const phone = sanitizePhone(opts.cliente.telefono);
  const text = buildWhatsappText(opts);
  if (phone.length >= 7) {
    return `https://wa.me/${phone}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}
