import { useState } from 'react';
import type { Medication } from '../types';
import { MARCAS, CATEGORIAS } from '../types';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import { PRICES } from '../data/prices';
import { tiersFor } from '../lib/pricing';
import { formatGTQ } from '../lib/currency';
import MedImage from './MedImage';

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
  const price = PRICES[med.id];
  const venta = price?.venta;
  const tresANueve = price?.tresANueve;
  const tiers = tiersFor(price);
  const hiddenTiers = tiers.filter(
    (t) => t.key === 'diezOMas' || t.key === 'volumen' || t.key === 'medico'
  );
  const hasHidden = hiddenTiers.length > 0;

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md active:scale-[0.998] transition-all overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="hidden sm:block shrink-0">
          <MedImage medId={med.id} marca={med.marca} size="sm" />
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(med)}
          className="text-left flex-1 min-w-0 group"
        >
          <div className="flex flex-wrap items-center gap-1.5 mb-1 sm:hidden">
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
          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate group-hover:text-blue-700 transition">
            {med.nombreComercial}
          </h3>
          {med.nombreGenerico && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{med.nombreGenerico}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-0.5 italic">{med.presentacion}</p>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {inCart > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              {inCart} en cotiz.
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 flex flex-wrap items-center gap-2 sm:gap-3">
        {venta !== undefined && <PriceChip label="Venta" value={venta} tone="blue" />}
        {tresANueve !== undefined && <PriceChip label="3 a 9" value={tresANueve} tone="emerald" />}
        {hasHidden && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition active:scale-[0.97]"
          >
            {expanded ? (
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
        <button
          type="button"
          onClick={() => onOpenDetail(med)}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-700 transition active:scale-[0.97]"
          title="Abrir ficha técnica"
        >
          <span className="hidden sm:inline">Ficha</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {hasHidden && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-3 pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
                  Otros niveles de precio
                </div>
                <div className="flex flex-wrap gap-2">
                  {hiddenTiers.map((t) => (
                    <PriceChip
                      key={t.key}
                      label={
                        t.key === 'diezOMas'
                          ? '10+'
                          : t.key === 'volumen'
                            ? 'Volumen'
                            : 'Médico'
                      }
                      value={t.price}
                      tone={
                        t.key === 'diezOMas'
                          ? 'indigo'
                          : t.key === 'volumen'
                            ? 'amber'
                            : 'red'
                      }
                      small
                    />
                  ))}
                </div>
                {price?.condicion && (
                  <p className="text-[10px] text-amber-700 italic mt-2">
                    {price.condicion}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceChip({
  label,
  value,
  tone,
  small = false,
}: {
  label: string;
  value: number;
  tone: 'blue' | 'emerald' | 'indigo' | 'red' | 'amber';
  small?: boolean;
}) {
  const palette: Record<typeof tone, string> = {
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-800',
    red: 'bg-red-50 border-red-100 text-red-800',
    amber: 'bg-amber-50 border-amber-100 text-amber-800',
  };
  return (
    <div
      className={`${palette[tone]} border rounded-lg ${
        small ? 'px-2.5 py-1' : 'px-3 py-1.5'
      }`}
    >
      <div
        className={`${
          small ? 'text-[9px]' : 'text-[9px]'
        } uppercase font-bold tracking-wider opacity-80 leading-none mb-0.5`}
      >
        {label}
      </div>
      <div className={`${small ? 'text-xs' : 'text-sm'} font-extrabold leading-tight`}>
        {formatGTQ(value)}
      </div>
    </div>
  );
}
