import { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MARCAS } from '../types';
import type { Marca } from '../types';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  marca?: Marca;
  open: boolean;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, caption, marca, open, onClose }: Props) {
  const [zoom, setZoom] = useState(1);

  // Resetear zoom y bloquear scroll al abrir; restaurar al cerrar.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setZoom(1);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 3));
      else if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 1));
      else if (e.key === '0') setZoom(1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!open) return null;

  const brand = marca ? MARCAS[marca] : null;
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));
  const reset = () => setZoom(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagen"
      className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-[0.92]"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="relative flex items-center justify-center w-full max-w-[92vw] h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-out select-none"
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
        />
      </div>

      <div
        className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
            aria-label="Reducir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white text-xs font-mono w-12 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={zoom === 1}
            className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition"
            aria-label="Restablecer zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {(caption || brand) && (
        <div
          className="mt-3 sm:mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {brand && (
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${brand.bg} ${brand.color}`}>
              {brand.short}
            </span>
          )}
          {caption && <span className="truncate max-w-[60vw]">{caption}</span>}
        </div>
      )}
    </div>
  );
}
