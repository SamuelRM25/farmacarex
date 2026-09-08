import type { Medication } from '../types';
import { CATEGORIAS } from '../types';
import { PRICES } from '../data/prices';
import { Plus, Info, Eye } from 'lucide-react';
import PriceBlock from './PriceBlock';
import { useState } from 'react';

interface Props {
  med: Medication;
  onAdd: (medId: string) => void;
  onOpenDetail: (med: Medication) => void;
}

export default function MedicationCard({ med, onAdd, onOpenDetail }: Props) {
  const cat = CATEGORIAS[med.categoria];
  const price = PRICES[med.id];
  const [justAdded, setJustAdded] = useState(false);

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
            {cat.label}
          </span>
          {price?.condicion && (
            <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
              {price.condicion}
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
        <p className="text-xs text-slate-700 mt-1.5 font-medium">
          {med.presentacion}
        </p>
      </div>

      <div className="px-4 py-3 bg-slate-50/50">
        <PriceBlock price={price} />
      </div>

      <div className="px-4 py-3 mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onOpenDetail(med)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          <Info className="w-4 h-4" />
          Ficha
        </button>
        <button
          type="button"
          onClick={() => {
            onAdd(med.id);
            setJustAdded(true);
            window.setTimeout(() => setJustAdded(false), 1500);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold rounded-lg transition shadow-sm ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Eye className="w-4 h-4" />
              Ver cotizador
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Agregar
            </>
          )}
        </button>
      </div>
    </article>
  );
}
