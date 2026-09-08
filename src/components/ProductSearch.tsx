import { useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, CheckCircle2, Search, X, Pill } from 'lucide-react';
import { MEDICATIONS } from '../data/medications';
import { MARCAS, CATEGORIAS, type PriceTier } from '../types';
import type { Medication } from '../types';
import { PRICES } from '../data/prices';
import { tiersFor, defaultTier } from '../lib/pricing';
import { formatGTQ } from '../lib/currency';
import PriceTierToggle from './PriceTierToggle';
import { useQuoterStore } from '../store/quoterStore';

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

export default function ProductSearch() {
  const addItem = useQuoterStore((s) => s.addItem);
  // Suscripción segura a `items` (referencia estable) — luego derivamos el mapa.
  const items = useQuoterStore((s) => s.items);

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedTier, setSelectedTierState] = useState<Record<string, PriceTier>>({});
  const [justAdded, setJustAdded] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLInputElement | null>(null);

  const cartById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of items) {
      map[i.medId] = (map[i.medId] ?? 0) + i.qty;
    }
    return map;
  }, [items]);

  const medOptions = useMemo(
    () =>
      [...MEDICATIONS]
        .map((m) => ({ id: m.id, label: m.nombreComercial }))
        .sort((a, b) => collator.compare(a.label, b.label)),
    []
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const needle = q.toLowerCase();
    return MEDICATIONS.filter((m) => searchHaystack(m).includes(needle))
      .sort((a, b) => collator.compare(a.nombreComercial, b.nombreComercial))
      .slice(0, 8);
  }, [query]);

  const handleAdd = (med: Medication) => {
    const tier = selectedTier[med.id] ?? defaultTier(PRICES[med.id]);
    addItem(med.id, tier);
    setJustAdded((s) => ({ ...s, [med.id]: true }));
    setExpanded((s) => ({ ...s, [med.id]: false }));
    window.setTimeout(() => {
      setJustAdded((s) => {
        const next = { ...s };
        delete next[med.id];
        return next;
      });
    }, 1600);
  };

  const handleClear = () => {
    setQuery('');
    setExpanded({});
    setSelectedTierState({});
    setJustAdded({});
    inputRef.current?.focus();
  };

  const visible = query.trim().length >= 2;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <header className="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-blue-700">
            Paso 1 · Buscá y agregá
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Buscar producto en el catálogo</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Escribí nombre, principio activo o presentación. Tocá <strong>Ver más precios</strong> si necesitás 10+ o Médico.
          </p>
        </div>
        {results.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition flex items-center gap-1 active:scale-[0.97]"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </header>

      <div className="px-4 sm:px-5 py-4 bg-slate-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            list="search-med-list"
            placeholder="Ej.: Moxifloxacino, Alphavit, Tabypress…"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
          <datalist id="search-med-list">
            {medOptions.map((o) => (
              <option key={o.id} value={o.label} />
            ))}
          </datalist>
        </div>

        {!visible && (
          <p className="mt-3 text-xs text-slate-400 italic">
            Empezá a tipear para ver resultados.
          </p>
        )}

        {visible && results.length === 0 && (
          <div className="mt-4 px-3 py-4 bg-white border border-dashed border-slate-200 rounded-lg flex items-center gap-2 text-sm text-slate-500">
            <Pill className="w-4 h-4 text-slate-300" />
            Sin resultados. Probá con otro término.
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {results.map((med, idx) => (
            <ResultRow
              key={med.id}
              med={med}
              index={idx}
              inCart={cartById[med.id] ?? 0}
              isExpanded={expanded[med.id] ?? false}
              selectedTier={selectedTier[med.id] ?? defaultTier(PRICES[med.id])}
              justAdded={justAdded[med.id] ?? false}
              onToggleExpand={() =>
                setExpanded((s) => ({ ...s, [med.id]: !s[med.id] }))
              }
              onSelectTier={(tier) =>
                setSelectedTierState((s) => ({ ...s, [med.id]: tier }))
              }
              onAdd={() => handleAdd(med)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function searchHaystack(m: Medication): string {
  return [
    m.nombreComercial,
    m.nombreGenerico ?? '',
    m.principioActivo ?? '',
    m.presentacion,
    m.categoria,
  ]
    .join(' ')
    .toLowerCase();
}

function ResultRow({
  med,
  index,
  inCart,
  isExpanded,
  selectedTier,
  justAdded,
  onToggleExpand,
  onSelectTier,
  onAdd,
}: {
  med: Medication;
  index: number;
  inCart: number;
  isExpanded: boolean;
  selectedTier: PriceTier;
  justAdded: boolean;
  onToggleExpand: () => void;
  onSelectTier: (t: PriceTier) => void;
  onAdd: () => void;
}) {
  const brand = MARCAS[med.marca];
  const cat = CATEGORIAS[med.categoria];
  const tiers = tiersFor(PRICES[med.id]);
  const venta = PRICES[med.id]?.venta;
  const tresANueve = PRICES[med.id]?.tresANueve;
  const visibleChipTiers = tresANueve !== undefined ? 2 : 1;
  const hasHidden = tiers.length > visibleChipTiers;
  const unit = tiers.find((t) => t.key === selectedTier)?.price ?? 0;

  return (
    <li
      className="px-4 sm:px-5 py-4 hover:bg-blue-50/30 transition animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
              {brand.short}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
            {inCart > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                {inCart} en cotiz.
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-tight">{med.nombreComercial}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 italic">{med.presentacion}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {venta !== undefined && (
            <PriceChip label="Venta" value={venta} color="blue" />
          )}
          {tresANueve !== undefined && (
            <PriceChip label="3 a 9" value={tresANueve} color="emerald" />
          )}
          {hasHidden && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition active:scale-[0.97]"
            >
              {isExpanded ? (
                <>
                  Ocultar
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Ver más precios
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isExpanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-3">
            <PriceTierToggle
              tier={selectedTier}
              onChange={onSelectTier}
              tiers={tiers}
              hideLabel
            />
            <button
              type="button"
              onClick={onAdd}
              disabled={unit <= 0 || justAdded}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold rounded-lg transition shadow-sm active:scale-[0.98] ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Agregado al cotizador
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Agregar al cotizador · {formatGTQ(unit)} c/u
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function PriceChip({ label, value, color }: { label: string; value: number; color: 'blue' | 'emerald' }) {
  const palette = {
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
  } as const;
  return (
    <div className={`px-3 py-1.5 border rounded-lg ${palette[color]} min-w-[88px]`}>
      <div className="text-[9px] uppercase font-bold tracking-wider opacity-80 leading-none">
        {label}
      </div>
      <div className="text-sm font-extrabold leading-tight">{formatGTQ(value)}</div>
    </div>
  );
}
