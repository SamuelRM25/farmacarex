export type Categoria =
  | 'gripe-tos'
  | 'gastro'
  | 'dolor'
  | 'antibiotico'
  | 'alergia'
  | 'ginecologia'
  | 'vitaminas'
  | 'antiparasitario'
  | 'cuidado-bebe'
  | 'dispositivo';

export type PriceTier = 'diez' | 'medico';

export interface Componente {
  componente: string;
  cantidad?: string;
}

export interface PriceTierInfo {
  venta: number;
  farmacia?: number;
  tresANueve?: number;
  diezOMas?: number;
  medico: number;
  condicion?: string;
}

export interface Medication {
  id: string;
  nombreComercial: string;
  nombreGenerico?: string;
  categoria: Categoria;
  presentacion: string;
  esGenerico?: boolean;
  formula?: Componente[];
  indicaciones?: string;
  posologia?: string;
  seguridad?: string;
}

export interface QuoteItem {
  medId: string;
  qty: number;
  tier: PriceTier;
}

export interface ClienteInfo {
  nombre: string;
  telefono: string;
  direccion: string;
  dpi?: string;
  notas?: string;
}

export interface MedicoInfo {
  nombre: string;
  colegiado?: string;
  especialidad?: string;
}

export interface SavedQuote {
  id: string;
  fecha: string;
  cliente: ClienteInfo;
  medico: MedicoInfo;
  items: QuoteItem[];
  notas: string;
  total: number;
}

export const CATEGORIAS: Record<Categoria, { label: string; color: string; }> = {
  'gripe-tos': { label: 'Gripe y tos', color: 'bg-sky-100 text-sky-700' },
  'gastro': { label: 'Gástricos / Crónicos', color: 'bg-amber-100 text-amber-700' },
  'dolor': { label: 'Dolor', color: 'bg-red-100 text-red-700' },
  'antibiotico': { label: 'Antibióticos', color: 'bg-purple-100 text-purple-700' },
  'alergia': { label: 'Antihistamínicos', color: 'bg-pink-100 text-pink-700' },
  'ginecologia': { label: 'Ginecológico', color: 'bg-fuchsia-100 text-fuchsia-700' },
  'vitaminas': { label: 'Vitaminas / Suplementos', color: 'bg-orange-100 text-orange-700' },
  'antiparasitario': { label: 'Antiparasitario', color: 'bg-emerald-100 text-emerald-700' },
  'cuidado-bebe': { label: 'Cuidado del bebé', color: 'bg-rose-100 text-rose-700' },
  'dispositivo': { label: 'Dispositivos / Otros', color: 'bg-slate-100 text-slate-700' },
};
