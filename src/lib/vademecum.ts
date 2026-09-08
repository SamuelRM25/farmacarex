import type { Medication } from '../types';

const VADEMECUM_SEARCH = 'https://www.vademecum.es/medicamentos';

export function vademecumSearchUrl(med: Medication): string {
  const query = (med.principioActivo ?? med.nombreComercial ?? '').trim();
  if (!query) return VADEMECUM_SEARCH;
  return `${VADEMECUM_SEARCH}?q=${encodeURIComponent(query)}`;
}

export function hasVademecumQuery(med: Medication): boolean {
  return Boolean((med.principioActivo ?? med.nombreComercial ?? '').trim());
}
