import type { QuoteItem, ClienteInfo, MedicoInfo } from '../types';
import { MEDICATION_BY_ID } from '../data/medications';
import { PRICES } from '../data/prices';

const PHONE_REGEX = /[^0-9+]/g;

function sanitizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(PHONE_REGEX, '');
}

function unitPrice(medId: string, tier: 'diez' | 'medico'): number {
  const p = PRICES[medId];
  if (!p) return 0;
  if (tier === 'medico') return p.medico;
  return p.diezOMas ?? p.medico;
}

export function computeTotal(items: QuoteItem[]): number {
  return items.reduce((acc, it) => acc + unitPrice(it.medId, it.tier) * it.qty, 0);
}

function qty(n: number): string {
  return `${n}`;
}

function money(value: number): string {
  return `Q ${value.toFixed(2)}`;
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
  if (opts.medico.nombre) lines.push(`Dr./Dra. ${opts.medico.nombre},`);
  lines.push('');
  lines.push('Adjunto la cotización de FarmaCarex:');
  lines.push('');

  opts.items.forEach((it) => {
    const med = MEDICATION_BY_ID[it.medId];
    const unit = unitPrice(it.medId, it.tier);
    const subtotal = unit * it.qty;
    const name = med ? med.nombreComercial : it.medId;
    lines.push(`• ${qty(it.qty)} × ${name} — ${money(subtotal)}`);
  });

  lines.push('');
  lines.push(`*Total: ${money(opts.total)}*`);
  lines.push('');
  lines.push(`Fecha: ${opts.fecha}`);
  if (opts.cliente.nombre) lines.push(`Cliente: ${opts.cliente.nombre}`);
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
