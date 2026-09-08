import type { Categoria } from '../types';
import { CATEGORIAS } from '../types';

interface Props {
  categorias: Categoria[];
  active: Categoria | 'todas';
  counts?: Record<string, number>;
  onSelect: (cat: Categoria | 'todas') => void;
}

export default function CategoryNav({ categorias, active, counts, onSelect }: Props) {
  return (
    <div className="relative -mx-4 sm:-mx-6">
      <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => onSelect('todas')}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
            active === 'todas'
              ? 'bg-blue-700 text-white border-blue-700 shadow'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          Todas
          {counts && (
            <span className="ml-1.5 text-xs opacity-70">({Object.values(counts).reduce((a, b) => a + b, 0)})</span>
          )}
        </button>

        {categorias.map((cat) => {
          const meta = CATEGORIAS[cat];
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelect(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                isActive
                  ? 'bg-blue-700 text-white border-blue-700 shadow'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {meta.label}
              {counts && counts[cat] !== undefined && (
                <span className="ml-1.5 text-xs opacity-70">({counts[cat]})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
