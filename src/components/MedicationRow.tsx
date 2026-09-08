import type { Medication } from '../types';
import { MARCAS, CATEGORIAS } from '../types';
import { Pill, ChevronRight } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import { PRICES } from '../data/prices';

interface Props {
  med: Medication;
  onOpenDetail: (med: Medication) => void;
}

export default function MedicationRow({ med, onOpenDetail }: Props) {
  const brand = MARCAS[med.marca];
  const cat = CATEGORIAS[med.categoria];
  const inCart = useQuoterStore((s) =>
    s.items.filter((i) => i.medId === med.id).reduce((acc, i) => acc + i.qty, 0)
  );
  const defaultPrice = PRICES[med.id]?.medico;

  const composicion =
    med.formula && med.formula.length > 0
      ? med.formula
          .map((c) => (c.cantidad ? `${c.componente} (${c.cantidad})` : c.componente))
          .join(' · ')
      : med.nombreGenerico ?? '—';

  return (
    <button
      type="button"
      onClick={() => onOpenDetail(med)}
      className="w-full text-left bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition px-4 py-3 flex items-center gap-3 group"
    >
      <div className="hidden sm:flex flex-col items-start gap-1 shrink-0 w-32">
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
          {brand.short}
        </span>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
          {cat.label}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 sm:hidden mb-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
            {brand.short}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
            {cat.label}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
          {med.nombreComercial}
        </h3>
        <div className="flex items-start gap-1.5 mt-0.5">
          <Pill className="w-3 h-3 text-slate-400 mt-0.5 shrink-0 hidden sm:block" />
          <p className="text-xs text-slate-600 line-clamp-1">{composicion}</p>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 italic">{med.presentacion}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {inCart > 0 && (
          <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            {inCart} en cotiz.
          </span>
        )}
        {defaultPrice !== undefined && defaultPrice > 0 && (
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Médico</span>
            <span className="text-xs font-extrabold text-slate-700">Q {defaultPrice.toFixed(2)}</span>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition" />
      </div>
    </button>
  );
}
