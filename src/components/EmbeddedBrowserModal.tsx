import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface Props {
  url: string | null;
  title: string;
  open: boolean;
  onClose: () => void;
}

export default function EmbeddedBrowserModal({ url, title, open, onClose }: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Resetear status cuando cambia la URL (al re-abrir o al cambiar de sitio).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setStatus('loading');
  }, [url, reloadKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Auto-detectar bloqueo: si después de 8s sigue 'loading', marcamos 'blocked'.
  useEffect(() => {
    if (!open || !url || status !== 'loading') return;
    const t = window.setTimeout(() => {
      setStatus((s) => (s === 'loading' ? 'blocked' : s));
    }, 8000);
    return () => window.clearTimeout(t);
  }, [open, url, status, reloadKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleReload = () => {
    setReloadKey((k) => k + 1);
  };

  if (!open || !url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 bg-white">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
              Vista integrada · sin salir de FarmaCarex
            </div>
            <h2 className="font-bold text-slate-900 truncate">{title}</h2>
            <p className="text-[11px] text-slate-400 truncate font-mono">{url}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleReload}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition active:scale-[0.95]"
              title="Recargar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-50">
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3 pointer-events-none z-10">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
              <p className="text-sm">Cargando {title.toLowerCase()}…</p>
            </div>
          )}

          {status === 'blocked' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white z-10">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                El sitio bloqueó la vista integrada
              </h3>
              <p className="text-sm text-slate-600 max-w-md mb-4">
                Por políticas del sitio, no se puede mostrar dentro de la app. Abrilo en una nueva pestaña para continuar.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition active:scale-[0.97]"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir {title.toLowerCase()} en nueva pestaña
              </a>
            </div>
          )}

          <iframe
            key={`${reloadKey}-${url}`}
            ref={iframeRef}
            src={url}
            title={title}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('blocked')}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
