export type Marca = 'ascavi' | 'medicbrand' | 'farma-cerex';

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

export type PriceTier = 'tresANueve' | 'diezOMas' | 'medico' | 'volumen';

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

export interface Comparativa {
  titulo: string;
  diferencia: string;
}

export interface Medication {
  id: string;
  nombreComercial: string;
  nombreGenerico?: string;
  marca: Marca;
  principioActivo?: string;
  categoria: Categoria;
  presentacion: string;
  esGenerico?: boolean;
  formula?: Componente[];
  indicaciones?: string;
  mecanismoAccion?: string;
  contraindicaciones?: string;
  efectosSecundarios?: string;
  posologia?: string;
  posologiaPorPeso?: string[];
  seguridad?: string;
  comparativa?: Comparativa[];
}

export interface TierOption {
  key: PriceTier;
  label: string;
  shortLabel: string;
  price: number;
  condicion?: string;
  color: 'blue' | 'indigo' | 'red' | 'amber';
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

export const MARCAS: Record<Marca, { label: string; short: string; color: string; bg: string; ring: string; }> = {
  ascavi: {
    label: 'Ascavi',
    short: 'Ascavi',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
  },
  medicbrand: {
    label: 'MedicBrand',
    short: 'MedicBrand',
    color: 'text-red-700',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
  },
  'farma-cerex': {
    label: 'FarmaCarex',
    short: 'FarmaCarex',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    ring: 'ring-slate-300',
  },
};

export const MARCA_ORDER: Marca[] = ['ascavi', 'medicbrand', 'farma-cerex'];
