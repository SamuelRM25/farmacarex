import type { Medication, PriceTier } from '../types';
import { MARCAS, CATEGORIAS } from '../types';
import { PRICES } from '../data/prices';
import { tiersFor, unitPriceForTier } from '../lib/pricing';
import PriceTierToggle from './PriceTierToggle';
import { formatGTQ } from '../lib/currency';
import { X, Plus, Minus } from 'lucide-react';

interface Props {
  med: Medication;
  tier: PriceTier;
  qty: number;
  onTierChange: (tier: PriceTier) => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}

export default function QuoteItem({ med, tier, qty, onTierChange, onQtyChange, onRemove }: Props) {
  const cat = CATEGORIAS[med.categoria];
  const brand = MARCAS[med.marca];
  const price = PRICES[med.id];
  const tiers = tiersFor(price);
  const unit = unitPriceForTier(price, tier);
  const subtotal = unit * qty;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
              {brand.short}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm leading-tight">
            {med.nombreComercial}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{med.presentacion}</p>
          {price?.condicion && (
            <p className="text-[10px] text-amber-700 mt-1 italic">{price.condicion}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Eliminar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <PriceTierToggle tier={tier} onChange={onTierChange} tiers={tiers} />

      <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">
            Cantidad
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="px-2 py-1.5 text-slate-600 hover:bg-slate-100"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10);
                onQtyChange(Number.isFinite(n) && n > 0 ? n : 1);
              }}
              className="w-12 text-center font-bold text-slate-800 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => onQtyChange(qty + 1)}
              className="px-2 py-1.5 text-slate-600 hover:bg-slate-100"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1">
            Subtotal
          </div>
          <div className="text-lg font-extrabold text-blue-800">
            {formatGTQ(subtotal)}
          </div>
          <div className="text-[11px] text-slate-500">
            {formatGTQ(unit)} c/u
          </div>
        </div>
      </div>
    </div>
  );
}
