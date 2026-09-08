import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, X } from 'lucide-react';
import { MEDICATIONS } from '../data/medications';
import { PRICES } from '../data/prices';
import type { Categoria, Medication, PriceTier } from '../types';
import { CATEGORIAS } from '../types';
import CategoryNav from '../components/CategoryNav';
import MedicationCard from '../components/MedicationCard';
import PriceTierToggle from '../components/PriceTierToggle';
import { useQuoterStore } from '../store/quoterStore';

const ORDER: Categoria[] = [
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

export default function Vademecum() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<Categoria | 'todas'>('todas');
  const [detailMed, setDetailMed] = useState<Medication | null>(null);
  const [pickerMed, setPickerMed] = useState<Medication | null>(null);
  const [pickerTier, setPickerTier] = useState<PriceTier>('medico');

  const addItem = useQuoterStore((s) => s.addItem);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MEDICATIONS.filter((m) => {
      if (cat !== 'todas' && m.categoria !== cat) return false;
      if (!q) return true;
      return (
        m.nombreComercial.toLowerCase().includes(q) ||
        (m.nombreGenerico ?? '').toLowerCase().includes(q) ||
        m.presentacion.toLowerCase().includes(q)
      );
    });
  }, [search, cat]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of MEDICATIONS) {
      map[m.categoria] = (map[m.categoria] ?? 0) + 1;
    }
    return map;
  }, []);

  const handleAddFromCatalog = (medId: string) => {
    setPickerMed(MEDICATIONS.find((m) => m.id === medId) ?? null);
  };

  const handleConfirmPicker = () => {
    if (!pickerMed) return;
    addItem(pickerMed.id, pickerTier);
    const chosen = pickerMed;
    const tier = pickerTier;
    setPickerMed(null);
    // Brief navigation hint
    navigate(`/cotizador?focus=${chosen.id}&tier=${tier}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vademécum
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catálogo completo de productos FarmaCarex · {MEDICATIONS.length} productos
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, genérico o presentación..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <CategoryNav
          categorias={ORDER}
          counts={counts}
          active={cat}
          onSelect={setCat}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
          <Pill className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">Sin resultados</p>
          <p className="text-sm text-slate-500 mt-1">
            Probá con otro término o cambiá la categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((med) => (
            <MedicationCard
              key={med.id}
              med={med}
              onAdd={handleAddFromCatalog}
              onOpenDetail={setDetailMed}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {detailMed && (
        <ModalDetail med={detailMed} onClose={() => setDetailMed(null)} />
      )}

      {/* Tier picker (add to cart) */}
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

function ModalDetail({ med, onClose }: { med: Medication; onClose: () => void }) {
  const cat = CATEGORIAS[med.categoria];
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
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between gap-3">
          <div>
            <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {med.nombreComercial}
            </h2>
            {med.nombreGenerico && (
              <p className="text-sm text-slate-600 mt-0.5">{med.nombreGenerico}</p>
            )}
            <p className="text-sm text-slate-700 mt-1">{med.presentacion}</p>
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
          <section className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Fórmula / Composición
            </h3>
            {med.formula && med.formula.length > 0 ? (
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
            ) : (
              <p className="text-sm italic text-slate-500">No especificada.</p>
            )}
          </section>

          {med.indicaciones && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Indicaciones
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{med.indicaciones}</p>
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

          {!med.indicaciones && !med.formula && (
            <p className="text-sm text-slate-500 italic">
              Sin ficha técnica detallada. Consultá con tu agente de ventas para más información.
            </p>
          )}
        </div>
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
  const price = PRICES[med.id];
  const unit = tier === 'medico' ? price?.medico ?? 0 : price?.diezOMas ?? price?.medico ?? 0;
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
          <PriceTierToggle
            tier={tier}
            onChange={setTier}
            precioDiez={price?.diezOMas ?? price?.medico ?? 0}
            precioMedico={price?.medico ?? 0}
          />

          <button
            type="button"
            onClick={onConfirm}
            disabled={unit <= 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-bold rounded-lg transition shadow-sm"
          >
            Agregar al cotizador
          </button>
        </div>
      </div>
    </div>
  );
}
