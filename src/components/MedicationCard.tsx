import type { Medication } from '../types';
import { MARCAS, CATEGORIAS } from '../types';
import { Info } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import CompositionList from './CompositionList';
import MedImage from './MedImage';

interface Props {
  med: Medication;
  onOpenDetail: (med: Medication) => void;
}

export default function MedicationCard({ med, onOpenDetail }: Props) {
  const brand = MARCAS[med.marca];
  const cat = CATEGORIAS[med.categoria];
  const inCart = useQuoterStore((s) =>
    s.items.filter((i) => i.medId === med.id).reduce((acc, i) => acc + i.qty, 0)
  );

  const hasComposition =
    (med.formula && med.formula.length > 0) || med.nombreGenerico;

  return (
    <article className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-4 flex gap-4">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
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

          <h3 className="font-bold text-slate-900 text-base leading-tight">
            {med.nombreComercial}
          </h3>
          {med.nombreGenerico && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {med.nombreGenerico}
            </p>
          )}

          <div className="mt-2.5 min-h-[3.5rem]">
            {hasComposition ? (
              <CompositionList med={med} variant="compact" />
            ) : (
              <p className="text-xs italic text-slate-400">Sin composición detallada.</p>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mt-2 italic">{med.presentacion}</p>
        </div>

        <div className="shrink-0">
          <MedImage medId={med.id} marca={med.marca} size="md" />
        </div>
      </div>

      <div className="px-4 pb-3 pt-0 flex gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(med)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
        >
          <Info className="w-4 h-4" />
          Ficha técnica
        </button>
      </div>
    </article>
  );
}
