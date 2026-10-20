import type { Categoria } from '../types';

export interface AdPalette {
  id: string;
  /** Fondo: degradado de dos tonos (arriba → abajo). */
  bg: [string, string];
  /** Color profundo para tipografía sobre el fondo. */
  deep: string;
  /** Color de la píldora/badge. */
  accent: string;
  /** Color del resplandor radial detrás del producto. */
  glow: string;
  /** Tono del line-art botánico. */
  line: string;
}

export const AD_PALETTES: AdPalette[] = [
  { id: 'menta',    bg: ['#7CC79B', '#4FA97A'], deep: '#10402C', accent: '#FFD166', glow: '#C9EBD7', line: '#2E7A56' },
  { id: 'terracota',bg: ['#E99070', '#C9553F'], deep: '#4A1B0F', accent: '#FFD9A0', glow: '#F7D2BE', line: '#A63A28' },
  { id: 'oceano',   bg: ['#5FC3DF', '#2C87AE'], deep: '#0A3547', accent: '#FFE066', glow: '#BFEBF7', line: '#1E6B92' },
  { id: 'lavanda',  bg: ['#C0A9EC', '#8A6ACB'], deep: '#2C1B4C', accent: '#FFD6A5', glow: '#E4D9FA', line: '#6B4EA8' },
  { id: 'ambar',    bg: ['#F7C36B', '#DD8F27'], deep: '#4A2E0A', accent: '#1F5D4F', glow: '#FCE7C4', line: '#B4731B' },
  { id: 'bosque',   bg: ['#6BA98A', '#35755A'], deep: '#0E2A1E', accent: '#E9C46A', glow: '#C2E2D0', line: '#245640' },
  { id: 'cereza',   bg: ['#F58CAB', '#C7476B'], deep: '#400F20', accent: '#FFE0B2', glow: '#FBC9D8', line: '#9C3352' },
  { id: 'turquesa', bg: ['#66D0B8', '#259A8B'], deep: '#0A3B34', accent: '#FFF0A0', glow: '#B6EBDD', line: '#1B7C70' },
  { id: 'ciruela',  bg: ['#AE86D8', '#7246A8'], deep: '#251338', accent: '#FFCADF', glow: '#DCC7F0', line: '#5A3389' },
  { id: 'arena',    bg: ['#EFD18A', '#CFA02A'], deep: '#3F2E0A', accent: '#255D4C', glow: '#F8E8C4', line: '#A8801B' },
  { id: 'mentaosc', bg: ['#8ED3C4', '#3E9E92'], deep: '#0B3A34', accent: '#FFD166', glow: '#C9EDE4', line: '#2C7D72' },
  { id: 'lavanda2', bg: ['#B9A7E8', '#7B5BC4'], deep: '#2A1B4E', accent: '#FFEF9F', glow: '#E0D6F7', line: '#5F439A' },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Paleta determinista por producto: mismo producto → mismo color siempre. */
export function paletteFor(medId: string): AdPalette {
  return AD_PALETTES[hash(medId) % AD_PALETTES.length];
}

/** Tono del gradiente según el grupo farmacológico (no se muestra en el ad). */
const CATEGORY_TONE: Record<Categoria, number> = {
  'gripe-tos': 1,
  'dolor': 0,
  'antibiotico': 2,
  'gastro': 3,
  'alergia': 6,
  'ginecologia': 8,
  'vitaminas': 4,
  'antiparasitario': 5,
  'cuidado-bebe': 9,
};

export function paletteForCategory(medId: string, categoria: Categoria): AdPalette {
  const base = paletteFor(medId);
  const shift = (CATEGORY_TONE[categoria] ?? 0) % AD_PALETTES.length;
  return AD_PALETTES[(AD_PALETTES.indexOf(base) + shift) % AD_PALETTES.length];
}

/** Mensajes de campaña (no son categorías ni marcas: son mensajes de marca comercial). */
const CAMPAIGNS = [
  'NUEVA IMAGEN',
  'CALIDAD QUE CUIDA',
  'PARA TU DÍA A DÍA',
  'DISPARA TU BIENESTAR',
  'FORMULA CONFIABLE',
  'MAYORISTA EN GUATEMALA',
  'LO QUE BUSCAS, LO TENEMOS',
  'CUIDADO DE EXPERTO',
];

export function campaignFor(medId: string): string {
  return CAMPAIGNS[hash(medId + ':camp') % CAMPAIGNS.length];
}
