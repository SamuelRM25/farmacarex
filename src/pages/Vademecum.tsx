import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, X, LayoutGrid, List, Plus } from 'lucide-react';
import { MEDICATIONS } from '../data/medications';
import type { Categoria, Marca, Medication, PriceTier } from '../types';
import { CATEGORIAS, MARCAS, MARCA_ORDER } from '../types';
import MedicationCard from '../components/MedicationCard';
import MedicationRow from '../components/MedicationRow';
import PriceTierToggle from '../components/PriceTierToggle';
import { useQuoterStore } from '../store/quoterStore';
import { PRICES } from '../data/prices';
import { tiersFor } from '../lib/pricing';
import { formatGTQ } from '../lib/currency';

const CATEGORIA_ORDER: Categoria[] = [
  'gripe-tos',
  'dolor',
  'antibiotico',
  'gastro',
  'alergia',
  'ginecologia',
  'antiparasitario',
  'vitaminas',
  'cuidado-bebe',
  'dispositivo',
];

type ViewMode = 'grid' | 'list';

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

function compareMeds(a: Medication, b: Medication): number {
  const cmp = collator.compare(a.nombreComercial, b.nombreComercial);
  if (cmp !== 0) return cmp;
  return collator.compare(a.presentacion, b.presentacion);
}

const VIEW_MODE_KEY = 'farmacarex:vademecum:view';

export default function Vademecum() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [marca, setMarca] = useState<Marca | 'todas'>('todas');
  const [cat, setCat] = useState<Categoria | 'todas'>('todas');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'grid';
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    return stored === 'list' ? 'list' : 'grid';
  });
  const [detailMed, setDetailMed] = useState<Medication | null>(null);
  const [pickerMed, setPickerMed] = useState<Medication | null>(null);
  const [pickerTier, setPickerTier] = useState<PriceTier>('medico');

  const addItem = useQuoterStore((s) => s.addItem);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const brandCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of MEDICATIONS) {
      map[m.marca] = (map[m.marca] ?? 0) + 1;
    }
    return map;
  }, []);

  const catCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of MEDICATIONS) {
      if (marca !== 'todas' && m.marca !== marca) continue;
      map[m.categoria] = (map[m.categoria] ?? 0) + 1;
    }
    return map;
  }, [marca]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = MEDICATIONS.filter((m) => {
      if (marca !== 'todas' && m.marca !== marca) return false;
      if (cat !== 'todas' && m.categoria !== cat) return false;
      if (!q) return true;
      return (
        m.nombreComercial.toLowerCase().includes(q) ||
        (m.nombreGenerico ?? '').toLowerCase().includes(q) ||
        (m.principioActivo ?? '').toLowerCase().includes(q) ||
        m.presentacion.toLowerCase().includes(q)
      );
    });

    list.sort((a, b) => {
      if (marca === 'todas' && cat === 'todas') {
        const ma = MARCA_ORDER.indexOf(a.marca);
        const mb = MARCA_ORDER.indexOf(b.marca);
        if (ma !== mb) return ma - mb;
      }
      return compareMeds(a, b);
    });
    return list;
  }, [search, marca, cat]);

  const grouped = useMemo(() => {
    if (marca !== 'todas' || cat !== 'todas') return null;
    const map: Record<Marca, Medication[]> = {
      ascavi: [],
      medicbrand: [],
      'farma-cerex': [],
    };
    for (const m of filtered) map[m.marca].push(m);
    return map;
  }, [filtered, marca, cat]);

  const openDetail = (m: Medication) => setDetailMed(m);

  const handleConfirmPicker = () => {
    if (!pickerMed) return;
    addItem(pickerMed.id, pickerTier);
    const chosen = pickerMed;
    const tier = pickerTier;
    setPickerMed(null);
    window.setTimeout(() => {
      navigate(`/cotizador?focus=${chosen.id}&tier=${tier}`);
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Vademécum
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {MEDICATIONS.length} productos · {brandCounts['ascavi'] ?? 0} Ascavi · {brandCounts['medicbrand'] ?? 0} MedicBrand · {brandCounts['farma-cerex'] ?? 0} FarmaCarex
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Modo de vista"
            className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'grid'
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Cuadrícula
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'list'
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, genérico, principio activo..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="relative -mx-4 sm:-mx-6">
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setMarca('todas')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                marca === 'todas'
                  ? 'bg-slate-800 text-white border-slate-800 shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              Todas las marcas
              <span className="ml-1.5 text-xs opacity-70">({MEDICATIONS.length})</span>
            </button>
            {MARCA_ORDER.map((m) => {
              const meta = MARCAS[m];
              const isActive = marca === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMarca(m)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    isActive
                      ? `${meta.bg} ${meta.color} border-current shadow`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {meta.label}
                  {brandCounts[m] !== undefined && (
                    <span className="ml-1.5 text-xs opacity-70">({brandCounts[m]})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative -mx-4 sm:-mx-6">
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setCat('todas')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                cat === 'todas'
                  ? 'bg-blue-700 text-white border-blue-700 shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              Todas
            </button>
            {CATEGORIA_ORDER.map((c) => {
              const meta = CATEGORIAS[c];
              const isActive = cat === c;
              const count = catCounts[c] ?? 0;
              if (count === 0 && cat !== c) return null;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    isActive
                      ? 'bg-blue-700 text-white border-blue-700 shadow'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {meta.label}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
          <Pill className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">Sin resultados</p>
          <p className="text-sm text-slate-500 mt-1">
            Probá con otro término o cambiá la marca / categoría.
          </p>
        </div>
      ) : grouped ? (
        <div className="space-y-8">
          {(['ascavi', 'medicbrand', 'farma-cerex'] as Marca[]).map((m) => {
            const items = grouped[m];
            if (items.length === 0) return null;
            const meta = MARCAS[m];
            return (
              <section key={m}>
                <header className="flex items-baseline justify-between mb-3 px-1">
                  <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${meta.color}`}>
                    {meta.label}
                  </h2>
                  <span className="text-xs text-slate-500">
                    {items.length} producto{items.length === 1 ? '' : 's'}
                  </span>
                </header>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((med) => (
                      <MedicationCard key={med.id} med={med} onOpenDetail={openDetail} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((med) => (
                      <MedicationRow key={med.id} med={med} onOpenDetail={openDetail} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((med) => (
            <MedicationCard key={med.id} med={med} onOpenDetail={openDetail} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((med) => (
            <MedicationRow key={med.id} med={med} onOpenDetail={openDetail} />
          ))}
        </div>
      )}

      {detailMed && (
        <ModalDetail
          med={detailMed}
          onClose={() => setDetailMed(null)}
          onOpenPicker={(med) => {
            setPickerMed(med);
            setDetailMed(null);
          }}
        />
      )}

      {pickerMed && (
        <ModalPicker
          med={pickerMed}
          tier={pickerTier}
          setTier={setPickerTier}
          onConfirm={handleConfirmPicker}
          onClose={() => setPickerMed(null)}
        />
      )}
    </div>
  );
}

function ModalDetail({
  med,
  onClose,
  onOpenPicker,
}: {
  med: Medication;
  onClose: () => void;
  onOpenPicker: (med: Medication) => void;
}) {
  const cat = CATEGORIAS[med.categoria];
  const brand = MARCAS[med.marca];
  const tierCount = tiersFor(PRICES[med.id]).length;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
                {brand.short}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
                {cat.label}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              {med.nombreComercial}
            </h2>
            {med.nombreGenerico && (
              <p className="text-sm text-slate-600 mt-0.5">{med.nombreGenerico}</p>
            )}
            <p className="text-sm text-slate-700 mt-1">{med.presentacion}</p>
            {tierCount > 0 && (
              <p className="text-xs text-blue-700 mt-2 font-semibold">
                Disponible en {tierCount} nivel{tierCount === 1 ? '' : 'es'} de precio · elegí el nivel al agregarlo al cotizador.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {med.formula && med.formula.length > 0 && (
            <section className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Fórmula / Composición
              </h3>
              <ul className="space-y-1">
                {med.formula.map((c, i) => (
                  <li key={i} className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-700">{c.componente}</span>
                    {c.cantidad && (
                      <span className="font-semibold text-slate-900 text-right">{c.cantidad}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {med.indicaciones && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Indicaciones
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{med.indicaciones}</p>
            </section>
          )}

          {med.mecanismoAccion && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Mecanismo de acción
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {med.mecanismoAccion}
              </p>
            </section>
          )}

          {med.contraindicaciones && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2">
                Contraindicaciones
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {med.contraindicaciones}
              </p>
            </section>
          )}

          {med.efectosSecundarios && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                Efectos secundarios
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {med.efectosSecundarios}
              </p>
            </section>
          )}

          {med.posologiaPorPeso && med.posologiaPorPeso.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Posología por peso
              </h3>
              <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
                {med.posologiaPorPeso.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>
          )}

          {med.posologia && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Posología
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {med.posologia}
              </p>
            </section>
          )}

          {med.seguridad && (
            <section className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                Seguridad y precauciones
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {med.seguridad}
              </p>
            </section>
          )}

          {med.comparativa && med.comparativa.length > 0 && (
            <section className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
                Comparativa
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {med.comparativa.map((c, i) => (
                  <li key={i}>
                    <div className="font-semibold text-slate-900">{c.titulo}</div>
                    <p className="leading-relaxed">{c.diferencia}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!med.indicaciones && !med.formula && !med.mecanismoAccion && (
            <p className="text-sm text-slate-500 italic">
              Sin ficha técnica detallada. Consultá con tu agente de ventas para más información.
            </p>
          )}
        </div>

        {tierCount > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={() => onOpenPicker(med)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg transition shadow-sm bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-5 h-5" />
              Agregar al cotizador
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalPicker({
  med,
  tier,
  setTier,
  onConfirm,
  onClose,
}: {
  med: Medication;
  tier: PriceTier;
  setTier: (t: PriceTier) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const tiers = tiersFor(PRICES[med.id]);
  const availableTier = tiers.find((t) => t.key === tier);
  useEffect(() => {
    if (!availableTier && tiers.length > 0) {
      setTier(tiers[0].key);
    }
  }, [availableTier, tiers, setTier]);

  const unit = availableTier?.price ?? tiers[0]?.price ?? 0;
  const activeTier = availableTier?.key ?? tiers[0]?.key ?? tier;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">{med.nombreComercial}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{med.presentacion}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <PriceTierToggle tier={activeTier} onChange={setTier} tiers={tiers} />
          <p className="text-xs text-slate-500 text-center">
            Podés cambiar el nivel más tarde en el cotizador.
          </p>

          <button
            type="button"
            onClick={onConfirm}
            disabled={unit <= 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-bold rounded-lg transition shadow-sm"
          >
            Agregar al cotizador · {formatGTQ(unit)} c/u
          </button>
        </div>
      </div>
    </div>
  );
}
