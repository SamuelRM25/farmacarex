import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileDown, MessageCircle, Save, Trash2, ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import { MEDICATION_BY_ID } from '../data/medications';
import QuoteItem from '../components/QuoteItem';
import { formatGTQ, todayISO } from '../lib/currency';
import { generateQuotePDF } from '../lib/pdf';
import { buildWhatsappLink } from '../lib/whatsapp';

export default function Cotizador() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const focusId = params.get('focus');

  const cliente = useQuoterStore((s) => s.cliente);
  const medico = useQuoterStore((s) => s.medico);
  const items = useQuoterStore((s) => s.items);
  const notas = useQuoterStore((s) => s.notas);
  const fecha = useQuoterStore((s) => s.fecha);
  const setCliente = useQuoterStore((s) => s.setCliente);
  const setMedico = useQuoterStore((s) => s.setMedico);
  const setNotas = useQuoterStore((s) => s.setNotas);
  const setFecha = useQuoterStore((s) => s.setFecha);
  const updateQty = useQuoterStore((s) => s.updateQty);
  const setTier = useQuoterStore((s) => s.setTier);
  const removeItem = useQuoterStore((s) => s.removeItem);
  const reset = useQuoterStore((s) => s.reset);
  const guardarHistorial = useQuoterStore((s) => s.guardarHistorial);

  const [status, setStatus] = useState<'idle' | 'pdf' | 'whatsapp' | 'saved'>('idle');

  const totalReal = useQuoterStore((s) => s.total)();

  useEffect(() => {
    if (focusId) {
      const t = window.setTimeout(() => {
        navigate('/cotizador', { replace: true });
      }, 100);
      return () => window.clearTimeout(t);
    }
    return;
  }, [focusId, navigate]);

  const handleExportPdf = async () => {
    try {
      setStatus('pdf');
      await generateQuotePDF({
        cliente,
        medico,
        items,
        notas,
        fecha,
        total: totalReal,
      });
    } catch (e) {
      console.error(e);
    } finally {
      window.setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const handleWhatsapp = () => {
    setStatus('whatsapp');
    const url = buildWhatsappLink({ cliente, medico, items, total: totalReal, fecha });
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  const handleSave = () => {
    guardarHistorial();
    setStatus('saved');
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <Header />

        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Tu cotización está vacía</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Ve al vademécum y agregá los productos que querés cotizar. Cada ítem te dejará elegir entre
            Precio 10+ y Precio Médico.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Ir al vademécum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: form + items */}
        <div className="xl:col-span-2 space-y-4">
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-3">
              Datos del cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Nombre"
                value={cliente.nombre}
                onChange={(v) => setCliente({ nombre: v })}
                placeholder="Cliente / Establecimiento"
              />
              <Field
                label="Teléfono"
                value={cliente.telefono}
                onChange={(v) => setCliente({ telefono: v })}
                placeholder="+502 4000 0000"
                type="tel"
              />
              <Field
                label="Dirección"
                value={cliente.direccion}
                onChange={(v) => setCliente({ direccion: v })}
                placeholder="Dirección de entrega"
                full
              />
              <Field
                label="DPI / NIT"
                value={cliente.dpi ?? ''}
                onChange={(v) => setCliente({ dpi: v })}
                placeholder="Opcional"
              />
              <Field
                label="Fecha"
                value={fecha}
                onChange={(v) => setFecha(v || todayISO())}
                type="date"
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-3">
              Médico que prescribe (opcional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field
                label="Nombre"
                value={medico.nombre}
                onChange={(v) => setMedico({ nombre: v })}
                placeholder="Dr./Dra."
              />
              <Field
                label="Colegiado"
                value={medico.colegiado ?? ''}
                onChange={(v) => setMedico({ colegiado: v })}
                placeholder="No. de colegiado"
              />
              <Field
                label="Especialidad"
                value={medico.especialidad ?? ''}
                onChange={(v) => setMedico({ especialidad: v })}
                placeholder="Pediatría, etc."
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700">
                Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Vaciar toda la cotización?')) reset();
                }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar
              </button>
            </div>

            <div className="space-y-3">
              {items.map((it) => {
                const med = MEDICATION_BY_ID[it.medId];
                if (!med) return null;
                return (
                  <QuoteItem
                    key={`${it.medId}-${it.tier}`}
                    med={med}
                    tier={it.tier}
                    qty={it.qty}
                    onTierChange={(tier) => setTier(it.medId, tier)}
                    onQtyChange={(qty) => updateQty(it.medId, qty)}
                    onRemove={() => removeItem(it.medId)}
                  />
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2">
              Notas / Observaciones
            </h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Indicaciones especiales, recordatorios, condiciones..."
            />
          </section>
        </div>

        {/* Right: sticky summary */}
        <div className="xl:col-span-1">
          <div className="sticky top-20 space-y-3">
            <div className="bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-2xl shadow-lg p-5">
              <div className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">
                Total
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold leading-none mb-3">
                {formatGTQ(totalReal)}
              </div>
              <div className="text-xs opacity-80">
                {items.reduce((acc, it) => acc + it.qty, 0)} unidades en {items.length} producto{items.length === 1 ? '' : 's'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={status === 'pdf'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-bold rounded-xl shadow-sm transition"
            >
              {status === 'pdf' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  PDF generado
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  Generar PDF
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsapp}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition"
            >
              {status === 'whatsapp' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Abriendo WhatsApp…
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Enviar por WhatsApp
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition"
            >
              {status === 'saved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Guardado en historial
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar en historial
                </>
              )}
            </button>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
              <p className="font-semibold text-slate-700 mb-1">Validez</p>
              <p>Esta pre-orden tiene validez de 15 días calendario. Los precios están sujetos a disponibilidad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Cotizador
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Armá tu pre-orden y exportá a PDF o enviá por WhatsApp.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'date';
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
      />
    </label>
  );
}
