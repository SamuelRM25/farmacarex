import type { Medication } from '../types';

function clean(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/^[-–—•\s]+/, '')
    .replace(/[.;:]+$/, '')
    .trim();
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Extrae 2–3 frases cortas y verificables del producto real.
 * Prioriza: indicaciones → efectos secundarios → componentes (sin cantidades).
 */
export function benefitsFor(med: Medication, count = 3): string[] {
  const out: string[] = [];
  // Texto ya mencionado en el subtítulo/título: no lo repetimos como bullet.
  const already = `${med.nombreComercial} ${med.nombreGenerico ?? ''} ${med.presentacion}`
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü ]+/g, ' ');

  const push = (s: string) => {
    const c = clean(s);
    if (!c) return;
    if (c.length < 5 || c.length > 46) return;
    const norm = c.toLowerCase().replace(/[^a-z0-9áéíóúñü ]+/g, ' ').trim();
    if (out.some((o) => o.toLowerCase() === norm)) return;
    // Si la frase completa ya está en el subtítulo/título, la saltamos.
    if (norm.length > 3 && already.includes(norm)) return;
    out.push(titleCase(c));
  };

  // 1) Indicaciones: fragmentos cortos (habitualmente el nombre de la dolencia).
  if (med.indicaciones) {
    const parts = med.indicaciones
      .split(/[;,]\s*|\s+e\s+/i)
      .map(clean)
      .filter((p) => p.length >= 6 && p.length <= 46)
      .slice(0, 10);
    for (const p of parts) {
      push(p);
      if (out.length >= count) break;
    }
  }

  // 2) Componentes: solo el nombre del componente (sin cantidades).
  if (out.length < count && med.formula?.length) {
    for (const c of med.formula) {
      push(c.componente);
      if (out.length >= count) break;
    }
  }

  // 3) Efectos secundarios / contraindicaciones.
  if (out.length < count && med.efectosSecundarios) {
    const parts = med.efectosSecundarios
      .split(/[;,]\s*/)
      .map(clean)
      .filter((p) => p.length >= 6 && p.length <= 40)
      .slice(0, 6);
    for (const p of parts) {
      push(p);
      if (out.length >= count) break;
    }
  }

  // 4) Posología.
  if (out.length < count && med.posologia) {
    push(clean(med.posologia.split(/[.;]/)[0]));
  }

  // 5) Fallback: presentación.
  if (out.length === 0 && med.presentacion) {
    push(med.presentacion);
  }

  return out.slice(0, count);
}

/** Subtítulo corto: el nombre genérico sin "(como ...)" ni cantidades redundantes. */
export function subtitleFor(med: Medication): string {
  const g = med.nombreGenerico?.trim();
  if (!g) return med.presentacion;
  return g;
}
