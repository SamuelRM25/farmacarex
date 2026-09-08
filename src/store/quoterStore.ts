import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  QuoteItem,
  ClienteInfo,
  MedicoInfo,
  SavedQuote,
  PriceTier,
} from '../types';
import { todayISO } from '../lib/currency';
import { MEDICATION_BY_ID } from '../data/medications';
import { PRICES } from '../data/prices';
import { tiersFor, unitPriceForTier } from '../lib/pricing';

interface QuoterState {
  cliente: ClienteInfo;
  medico: MedicoInfo;
  items: QuoteItem[];
  notas: string;
  fecha: string;
  historial: SavedQuote[];

  setCliente: (patch: Partial<ClienteInfo>) => void;
  setMedico: (patch: Partial<MedicoInfo>) => void;
  setNotas: (notas: string) => void;
  setFecha: (fecha: string) => void;

  addItem: (medId: string, tier: PriceTier, qty?: number) => void;
  removeItem: (medId: string) => void;
  updateQty: (medId: string, qty: number) => void;
  setTier: (medId: string, tier: PriceTier) => void;
  reset: () => void;

  total: () => number;

  guardarHistorial: () => string;
  eliminarHistorial: (id: string) => void;
  cargarHistorial: (id: string) => void;
  duplicarHistorial: (id: string) => void;
}

const initialCliente: ClienteInfo = { nombre: '', telefono: '+502', direccion: '' };
const initialMedico: MedicoInfo = { nombre: '', colegiado: '', especialidad: '' };

const LEGACY_TIER_MAP: Record<string, PriceTier> = {
  diez: 'diezOMas',
  medico: 'medico',
  venta: 'medico',
  diezOMas: 'diezOMas',
  tresANueve: 'tresANueve',
  volumen: 'volumen',
};

function migrateTier(t: unknown): PriceTier {
  if (typeof t === 'string' && LEGACY_TIER_MAP[t]) return LEGACY_TIER_MAP[t] as PriceTier;
  return 'medico';
}

function migrateQuoteItem(item: Partial<QuoteItem>): QuoteItem {
  const medId = typeof item.medId === 'string' ? item.medId : '';
  const qty = Math.max(1, Number(item.qty ?? 1) || 1);
  return { medId, qty, tier: migrateTier(item.tier) };
}

function migrateHistorial(items: Partial<SavedQuote>[]): SavedQuote[] {
  return items.map((q) => ({
    id: typeof q.id === 'string' ? q.id : `q_legacy_${Math.random().toString(36).slice(2, 10)}`,
    fecha: typeof q.fecha === 'string' ? q.fecha : todayISO(),
    cliente: q.cliente ?? { nombre: '', telefono: '', direccion: '' },
    medico: q.medico ?? { nombre: '', colegiado: '', especialidad: '' },
    notas: typeof q.notas === 'string' ? q.notas : '',
    total: Number(q.total ?? 0),
    items: Array.isArray(q.items) ? q.items.map(migrateQuoteItem) : [],
  }));
}

function computeTotal(items: QuoteItem[]): number {
  return items.reduce((acc, it) => acc + unitPriceForTier(PRICES[it.medId], it.tier) * it.qty, 0);
}

export const useQuoterStore = create<QuoterState>()(
  persist(
    (set, get) => ({
      cliente: initialCliente,
      medico: initialMedico,
      items: [],
      notas: '',
      fecha: todayISO(),
      historial: [],

      setCliente: (patch) =>
        set((s) => ({ cliente: { ...s.cliente, ...patch } })),
      setMedico: (patch) =>
        set((s) => ({ medico: { ...s.medico, ...patch } })),
      setNotas: (notas) => set({ notas }),
      setFecha: (fecha) => set({ fecha }),

      addItem: (medId, tier, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.medId === medId && i.tier === tier);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i === existing ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...s.items, { medId, tier, qty }] };
        }),

      removeItem: (medId) =>
        set((s) => ({ items: s.items.filter((i) => i.medId !== medId) })),

      updateQty: (medId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.medId === medId ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),

      setTier: (medId, tier) =>
        set((s) => {
          const current = s.items.find((i) => i.medId === medId);
          if (!current) return s;
          if (current.tier === tier) return s;
          const otherWithSameTier = s.items.find(
            (i) => i.medId === medId && i.tier === tier && i !== current
          );
          if (otherWithSameTier) {
            return {
              items: s.items
                .filter((i) => i !== current)
                .map((i) =>
                  i === otherWithSameTier ? { ...i, qty: i.qty + current.qty } : i
                ),
            };
          }
          return {
            items: s.items.map((i) => (i.medId === medId ? { ...i, tier } : i)),
          };
        }),

      reset: () =>
        set({
          cliente: initialCliente,
          medico: initialMedico,
          items: [],
          notas: '',
          fecha: todayISO(),
        }),

      total: () => computeTotal(get().items),

      guardarHistorial: () => {
        const state = get();
        const id = `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        const quote: SavedQuote = {
          id,
          fecha: state.fecha,
          cliente: { ...state.cliente },
          medico: { ...state.medico },
          items: state.items.map((i) => ({ ...i })),
          notas: state.notas,
          total: computeTotal(state.items),
        };
        set((s) => ({ historial: [quote, ...s.historial].slice(0, 200) }));
        return id;
      },

      eliminarHistorial: (id) =>
        set((s) => ({ historial: s.historial.filter((q) => q.id !== id) })),

      cargarHistorial: (id) =>
        set((s) => {
          const q = s.historial.find((x) => x.id === id);
          if (!q) return s;
          return {
            cliente: { ...q.cliente },
            medico: { ...q.medico },
            items: q.items.map((i) => ({ ...i })),
            notas: q.notas,
            fecha: q.fecha,
          };
        }),

      duplicarHistorial: (id) =>
        set((s) => {
          const q = s.historial.find((x) => x.id === id);
          if (!q) return s;
          const newId = `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
          const copy: SavedQuote = {
            ...q,
            id: newId,
            cliente: { ...q.cliente },
            medico: { ...q.medico },
            items: q.items.map((i) => ({ ...i })),
            fecha: todayISO(),
          };
          return { historial: [copy, ...s.historial].slice(0, 200) };
        }),
    }),
    {
      name: 'farmacarex:state',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<QuoterState> | undefined;
        const migrated: Partial<QuoterState> = {
          cliente: state?.cliente ?? initialCliente,
          medico: state?.medico ?? initialMedico,
          items: Array.isArray(state?.items) ? state.items.map(migrateQuoteItem) : [],
          notas: state?.notas ?? '',
          fecha: state?.fecha ?? todayISO(),
          historial: Array.isArray(state?.historial) ? migrateHistorial(state.historial) : [],
        };
        return migrated as unknown as QuoterState;
      },
    }
  )
);

// Re-export helpers for components that don't want to import lib directly
export { tiersFor, unitPriceForTier };
export { MEDICATION_BY_ID };
