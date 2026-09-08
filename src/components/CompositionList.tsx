import type { Medication } from '../types';

interface Props {
  med: Medication;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export default function CompositionList({ med, variant = 'compact', className = '' }: Props) {
  const items = med.formula ?? [];
  const fallback = med.nombreGenerico ?? '';

  if (items.length === 0) {
    if (!fallback) {
      return (
        <p className={`text-xs italic text-slate-500 ${className}`}>
          Sin composición detallada.
        </p>
      );
    }
    return (
      <p className={`text-xs text-slate-600 leading-snug ${className}`}>
        <span className="font-semibold">Principio activo:</span> {fallback}
      </p>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={className}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              <th className="text-left pb-1.5">Componente</th>
              <th className="text-right pb-1.5">Cantidad / concentración</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-1.5 text-slate-700">{c.componente}</td>
                <td className="py-1.5 text-right font-mono text-xs font-semibold text-slate-900">
                  {c.cantidad ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // variant === 'compact'
  return (
    <ul className={`space-y-0.5 text-xs ${className}`}>
      {items.map((c, i) => (
        <li key={i} className="flex items-baseline gap-2">
          <span className="text-slate-700 shrink-0">{c.componente}</span>
          <span className="flex-1 border-b border-dotted border-slate-200 translate-y-1 min-w-[12px]" />
          {c.cantidad && (
            <span className="font-mono text-[11px] font-semibold text-slate-900 shrink-0">
              {c.cantidad}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
