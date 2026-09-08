import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileDown, MessageCircle, Save, Trash2, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useQuoterStore } from '../store/quoterStore';
import { MEDICATION_BY_ID } from '../data/medications';
import QuoteItem from '../components/QuoteItem';
import ProductSearch from '../components/ProductSearch';
import { formatGTQ, todayISO } from '../lib/currency';
import { generateQuotePDF } from '../lib/pdf';
import { buildWhatsappLink } from '../lib/whatsapp';

const PHONE_PREFIX = '+502';

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
  const phoneRef = useRef<HTMLInputElement | null>(null);

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

  const handlePhoneFocus = () => {
    if (!phoneRef.current) return;
    const input = phoneRef.current;
    if (input.value === PHONE_PREFIX) {
      window.setTimeout(() => {
        const end = input.value.length;
        input.setSelectionRange(end, end);
      }, 0);
    }
  };

  const handlePhoneChange = (v: string) => {
    if (!v.startsWith(PHONE_PREFIX) && v.length > 0 && !v.startsWith('+')) {
      setCliente({ telefono: PHONE_PREFIX });
      return;
    }
    setCliente({ telefono: v });
  };

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

  return (
    <div className="space-y-6">
      <Header />

      <div className="space-y-4">
        <ProductSearch />

        {items.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 sm:p-12 text-center animate-fade-in">
            <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h2 className="text-base font-bold text-slate-800">Tu cotización está vacía</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Usá el buscador de arriba para encontrar productos. Seleccioná el tier y agregá al cotizador.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    inputRef={phoneRef}
                    placeholder="4000 0000"
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
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 active:scale-[0.97] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((it, idx) => {
                    const med = MEDICATION_BY_ID[it.medId];
                    if (!med) return null;
                    return (
                      <div
                        key={`${it.medId}-${it.tier}`}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(idx, 6) * 40}ms` }}
                      >
                        <QuoteItem
                          med={med}
                          tier={it.tier}
                          qty={it.qty}
                          onTierChange={(tier) => setTier(it.medId, tier)}
                          onQtyChange={(qty) => updateQty(it.medId, qty)}
                          onRemove={() => removeItem(it.medId)}
                        />
                      </div>
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
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="Indicaciones especiales, recordatorios, condiciones..."
                />
              </section>
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-20 space-y-3">
                <div className="bg-gradient-to-br from-blue-800 to-blue-700 text-white rounded-2xl shadow-lg p-5 animate-fade-in">
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-bold rounded-xl shadow-sm active:scale-[0.98] transition"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm active:scale-[0.98] transition"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm active:scale-[0.98] transition"
                >
                  {status === 'saved' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Guardado en historial
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
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
        )}
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
        Buscá productos, elegí el nivel de precio y exportá a PDF o enviá por WhatsApp.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onFocus,
  inputRef,
  placeholder,
  type = 'text',
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
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
        ref={inputRef ?? undefined}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
      />
    </label>
  );
}
