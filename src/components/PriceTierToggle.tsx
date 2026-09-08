import type { PriceTier, TierOption } from '../types';
import { formatGTQ } from '../lib/currency';

interface Props {
  tier: PriceTier;
  onChange: (t: PriceTier) => void;
  tiers: TierOption[];
  hideLabel?: boolean;
}

const COLOR_ACTIVE: Record<TierOption['color'], string> = {
  blue: 'border-blue-700 bg-blue-50 text-blue-800',
  indigo: 'border-indigo-700 bg-indigo-50 text-indigo-800',
  red: 'border-red-500 bg-red-50 text-red-700',
  amber: 'border-amber-600 bg-amber-50 text-amber-800',
};

const COLOR_INACTIVE = 'border-slate-200 bg-white text-slate-600 hover:border-slate-300';

export default function PriceTierToggle({ tier, onChange, tiers, hideLabel }: Props) {
  if (tiers.length === 0) {
    return <div className="text-xs text-slate-400 italic">Sin niveles disponibles</div>;
  }

  return (
    <div className="space-y-2">
      {!hideLabel && (
        <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
          Nivel de precio
        </div>
      )}
      <div className={`grid gap-2 ${tiers.length <= 2 ? 'grid-cols-2' : tiers.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {tiers.map((t) => {
          const isActive = tier === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-lg border-2 transition ${
                isActive ? COLOR_ACTIVE[t.color] : COLOR_INACTIVE
              }`}
              title={t.label}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                {t.shortLabel}
              </span>
              <span className="text-base font-extrabold leading-tight">
                {formatGTQ(t.price)}
              </span>
              {t.condicion && (
                <span className="text-[9px] mt-0.5 opacity-80 font-semibold">
                  {t.condicion}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
