import type { PriceTier } from '../types';
import { formatGTQ } from '../lib/currency';

interface Props {
  tier: PriceTier;
  onChange: (t: PriceTier) => void;
  precioDiez: number;
  precioMedico: number;
}

export default function PriceTierToggle({ tier, onChange, precioDiez, precioMedico }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
        Elige el nivel de precio
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('diez')}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-lg border-2 transition ${
            tier === 'diez'
              ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Precio 10+</span>
          <span className="text-base font-extrabold">{formatGTQ(precioDiez)}</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('medico')}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-lg border-2 transition ${
            tier === 'medico'
              ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Precio Médico</span>
          <span className="text-base font-extrabold">{formatGTQ(precioMedico)}</span>
        </button>
      </div>
    </div>
  );
}
