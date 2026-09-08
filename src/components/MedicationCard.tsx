import type { Medication } from '../types';
import { MARCAS, CATEGORIAS } from '../types';
import { Info, Pill } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';

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

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
              {brand.short}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
          </div>
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
      </div>

      <div className="px-4 py-3 bg-slate-50/50 flex-1">
        <div className="flex items-start gap-2">
          <Pill className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700 leading-snug">
            <span className="font-semibold">Composición:</span>{' '}
            {med.formula && med.formula.length > 0
              ? med.formula
                  .map((c) => (c.cantidad ? `${c.componente} (${c.cantidad})` : c.componente))
                  .join(' · ')
              : med.nombreGenerico ?? '—'}
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 italic">{med.presentacion}</p>
      </div>

      <div className="px-4 py-3 flex gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(med)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          <Info className="w-4 h-4" />
          Ficha técnica
        </button>
      </div>
    </article>
  );
}
