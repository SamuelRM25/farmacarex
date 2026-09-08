import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Eye, Copy, Trash2, FileDown, X, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import { MEDICATION_BY_ID } from '../data/medications';
import { PRICES } from '../data/prices';
import { unitPriceForTier } from '../lib/pricing';
import { formatDate, formatGTQ } from '../lib/currency';
import { generateSavedQuotePDF } from '../lib/pdf';
import type { SavedQuote } from '../types';
import type { PriceTier } from '../types';

export default function Historial() {
  const historial = useQuoterStore((s) => s.historial);
  const cargarHistorial = useQuoterStore((s) => s.cargarHistorial);
  const eliminarHistorial = useQuoterStore((s) => s.eliminarHistorial);
  const duplicarHistorial = useQuoterStore((s) => s.duplicarHistorial);
  const navigate = useNavigate();
  const [detail, setDetail] = useState<SavedQuote | null>(null);
  const [status, setStatus] = useState<'idle' | 'saved' | 'deleted' | 'pdf'>('idle');

  if (historial.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historial
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cotizaciones guardadas localmente en este dispositivo.
          </p>
        </div>

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <HistoryIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Sin cotizaciones guardadas</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Cuando generes una cotización en el cotizador, podés guardarla acá para volver a revisarla,
            descargarla o reenviarla.
          </p>
          <button
            type="button"
            onClick={() => navigate('/cotizador')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition"
          >
            <ShoppingCart className="w-4 h-4" />
            Ir al cotizador
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historial
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {historial.length} cotización{historial.length === 1 ? '' : 'es'} guardada{historial.length === 1 ? '' : 's'}.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
        {historial.map((q) => (
          <div
            key={q.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 truncate">
                  {q.cliente.nombre || 'Cliente sin nombre'}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {formatDate(q.fecha)}
                </span>
              </div>
              <div className="text-xs text-slate-500 truncate">
                {q.items.length} producto{q.items.length === 1 ? '' : 's'} ·
                {q.items.reduce((acc, i) => acc + i.qty, 0)} unidades
                {q.medico.nombre && ` · ${q.medico.nombre}`}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Total
                </div>
                <div className="text-base font-extrabold text-blue-800">
                  {formatGTQ(q.total)}
                </div>
              </div>
              <div className="flex gap-1.5">
                <IconBtn onClick={() => setDetail(q)} title="Ver detalle" Icon={Eye} />
                <IconBtn
                  onClick={async () => {
                    try {
                      setStatus('pdf');
                      await generateSavedQuotePDF(q);
                    } finally {
                      window.setTimeout(() => setStatus('idle'), 1500);
                    }
                  }}
                  title="Descargar PDF"
                  Icon={FileDown}
                  highlight={status === 'pdf'}
                />
                <IconBtn
                  onClick={() => {
                    cargarHistorial(q.id);
                    setStatus('saved');
                    window.setTimeout(() => {
                      setStatus('idle');
                      navigate('/cotizador');
                    }, 600);
                  }}
                  title="Reabrir en cotizador"
                  Icon={CheckCircle2}
                />
                <IconBtn
                  onClick={() => {
                    duplicarHistorial(q.id);
                    setStatus('saved');
                    window.setTimeout(() => setStatus('idle'), 1200);
                  }}
                  title="Duplicar"
                  Icon={Copy}
                />
                <IconBtn
                  onClick={() => {
                    if (window.confirm('¿Eliminar esta cotización del historial?')) {
                      eliminarHistorial(q.id);
                      setStatus('deleted');
                      window.setTimeout(() => setStatus('idle'), 1200);
                    }
                  }}
                  title="Eliminar"
                  Icon={Trash2}
                  danger
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {detail && <DetailModal quote={detail} onClose={() => setDetail(null)} />}

      {status === 'saved' && (
        <Toast color="bg-emerald-600">
          <CheckCircle2 className="w-4 h-4" />
          {status === 'saved' ? 'Cotización cargada en el editor' : null}
        </Toast>
      )}
      {status === 'deleted' && (
        <Toast color="bg-red-500">
          <Trash2 className="w-4 h-4" />
          Eliminada del historial
        </Toast>
      )}
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  Icon,
  highlight = false,
  danger = false,
}: {
  onClick: () => void;
  title: string;
  Icon: typeof Eye;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border transition ${
        highlight
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : danger
            ? 'border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
            : 'border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function DetailModal({ quote, onClose }: { quote: SavedQuote; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between gap-3">
          <div>
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {formatDate(quote.fecha)}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {quote.cliente.nombre || 'Cliente sin nombre'}
            </h2>
            {quote.medico.nombre && (
              <p className="text-sm text-slate-600 mt-0.5">{quote.medico.nombre}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoRow label="Teléfono" value={quote.cliente.telefono} />
            <InfoRow label="Dirección" value={quote.cliente.direccion} />
            <InfoRow label="Médico" value={quote.medico.nombre} />
            <InfoRow label="Colegiado" value={quote.medico.colegiado} />
          </div>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
              Items
            </h3>
            <div className="space-y-2">
              {quote.items.map((it, idx) => {
                const med = MEDICATION_BY_ID[it.medId];
                if (!med) return null;
                return (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50/50"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {med.nombreComercial}
                      </div>
                      <div className="text-xs text-slate-500">
                        {med.presentacion}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600">
                        {it.qty} × {formatGTQ(unitPriceSnapshot(it))}
                      </div>
                      <div className="font-bold text-blue-800">
                        {formatGTQ(subtotalSnapshot(it))}
                      </div>
                      <span
                        className={`inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          it.tier === 'medico'
                            ? 'bg-red-50 text-red-700'
                            : it.tier === 'diezOMas'
                              ? 'bg-indigo-50 text-indigo-700'
                              : it.tier === 'tresANueve'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {tierLabelSnapshot(it.tier)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {quote.notas && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                Notas
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{quote.notas}</p>
            </section>
          )}

          <div className="bg-blue-800 text-white rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider opacity-80">Total</span>
            <span className="text-2xl font-extrabold">{formatGTQ(quote.total)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => generateSavedQuotePDF(quote)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
            >
              <FileDown className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border border-slate-100 rounded-lg px-3 py-2 bg-slate-50/50">
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
        {label}
      </div>
      <div className="text-sm text-slate-800">{value || '—'}</div>
    </div>
  );
}

function unitPriceSnapshot(it: { medId: string; tier: PriceTier }): number {
  return unitPriceForTier(PRICES[it.medId], it.tier);
}

function subtotalSnapshot(it: { medId: string; tier: PriceTier; qty: number }): number {
  return unitPriceSnapshot(it) * it.qty;
}

function tierLabelSnapshot(tier: PriceTier): string {
  const map: Record<PriceTier, string> = {
    tresANueve: '3 a 9',
    diezOMas: '10+',
    medico: 'Médico',
    volumen: 'Volumen',
  };
  return map[tier] ?? '—';
}

function Toast({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      className={`fixed bottom-6 right-6 ${color} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 animate-fade-in z-50`}
    >
      {children}
    </div>
  );
}
