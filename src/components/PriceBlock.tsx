import { formatGTQ } from '../lib/currency';
import type { PriceTierInfo } from '../types';

interface Props {
  price: PriceTierInfo | undefined;
  showFarmacia?: boolean;
}

export default function PriceBlock({ price, showFarmacia = false }: Props) {
  if (!price) {
    return (
      <div className="text-xs text-slate-400 italic">Precios no disponibles</div>
    );
  }

  const hasTresANueve = price.tresANueve !== undefined;

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-blue-700/80 leading-tight">
          Precio Venta
        </div>
        <div className="text-base sm:text-lg font-extrabold text-blue-800 leading-tight">
          {formatGTQ(price.venta)}
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-2">
        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700/80 leading-tight">
          {hasTresANueve ? '3 a 9 unidades' : '10+ / Médico'}
        </div>
        <div className="text-base sm:text-lg font-extrabold text-emerald-800 leading-tight">
          {hasTresANueve ? formatGTQ(price.tresANueve) : formatGTQ(price.diezOMas ?? price.medico)}
        </div>
      </div>

      {showFarmacia && price.farmacia !== undefined && (
        <div className="col-span-2 flex justify-between items-center px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
          <span className="text-slate-500 font-medium">Precio Farmacia</span>
          <span className="font-semibold text-slate-700">{formatGTQ(price.farmacia)}</span>
        </div>
      )}
    </div>
  );
}
