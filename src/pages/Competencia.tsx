import { useMemo, useState } from 'react';
import { Search, ExternalLink, Loader2, BookOpen, AlertTriangle, Globe, GraduationCap } from 'lucide-react';
import { MEDICATIONS } from '../data/medications';
import { MARCAS, CATEGORIAS } from '../types';
import type { Medication } from '../types';
import { googleScholarUrl, googleSearchUrl, searchCompetencia, type CompetenciaResult } from '../lib/competencia';

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

export default function Competencia() {
  const [queryInput, setQueryInput] = useState('');
  const [medId, setMedId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompetenciaResult | null>(null);

  const selectedMed: Medication | undefined = useMemo(
    () => (medId ? MEDICATIONS.find((m) => m.id === medId) : undefined),
    [medId]
  );

  const medOptions = useMemo(() => {
    return [...MEDICATIONS]
      .map((m) => {
        const label = m.principioActivo
          ? `${m.nombreComercial} — ${m.principioActivo}`
          : m.nombreComercial;
        return { id: m.id, label, search: `${m.nombreComercial} ${m.principioActivo ?? ''}`.toLowerCase() };
      })
      .sort((a, b) => collator.compare(a.label, b.label));
  }, []);

  const handleSelectMed = (id: string) => {
    setMedId(id);
    const med = MEDICATIONS.find((m) => m.id === id);
    if (med) {
      const q = med.principioActivo ?? med.nombreGenerico ?? med.nombreComercial;
      setQueryInput(q);
      setResult(null);
      setError(null);
    }
  };

  const handleSearch = async (override?: { query: string; medId?: string }) => {
    const q = (override?.query ?? queryInput).trim();
    const idToUse = override?.medId ?? medId;
    if (!q) {
      setError('Ingresá un principio activo o seleccioná un medicamento de la lista.');
      return;
    }
    const med = idToUse ? MEDICATIONS.find((m) => m.id === idToUse) : undefined;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await searchCompetencia(q, med?.categoria);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo consultar DuckDuckGo. Verificá tu conexión y reintentá.');
    } finally {
      setLoading(false);
    }
  };

  // Si el query está vacío cuando cambia el medicamento, autocompletar (caso de selección por datalist).
  // En general, handleSelectMed ya setea queryInput; esto es defensa para casos extremos.

  const googleUrl = useMemo(() => {
    const q = queryInput.trim();
    if (!q) return null;
    if (selectedMed) {
      const presentacionKw = selectedMed.presentacion
        .replace(/Caja \d+\s*/i, '')
        .replace(/Frasco \d+\s*/i, '')
        .replace(/Ampolla \d+\s*/i, '')
        .trim();
      return googleSearchUrl(q, presentacionKw);
    }
    return googleSearchUrl(q);
  }, [queryInput, selectedMed]);

  const scholarUrl = useMemo(() => {
    const q = queryInput.trim();
    return q ? googleScholarUrl(q) : null;
  }, [queryInput]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Competencia
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Buscá información y precios de la competencia para el principio activo de cualquier producto FarmaCarex.
            Consultamos <strong>DuckDuckGo</strong> (info) y armamos un link directo a <strong>Google</strong> (precios Guatemala).
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
              1 · Seleccioná un producto FarmaCarex (opcional)
            </label>
            <input
              list="med-list"
              type="text"
              placeholder="Tusicarex, E-Mox, Alphavit…"
              value={
                selectedMed
                  ? `${selectedMed.nombreComercial}${
                      selectedMed.principioActivo ? ` — ${selectedMed.principioActivo}` : ''
                    }`
                  : ''
              }
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setMedId('');
                  return;
                }
                const match = medOptions.find((o) => o.label === value);
                if (match) handleSelectMed(match.id);
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <datalist id="med-list">
              {medOptions.map((o) => (
                <option key={o.id} value={o.label} />
              ))}
            </datalist>
            {selectedMed && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    MARCAS[selectedMed.marca].bg
                  } ${MARCAS[selectedMed.marca].color}`}
                >
                  {MARCAS[selectedMed.marca].short}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    CATEGORIAS[selectedMed.categoria].color
                  }`}
                >
                  {CATEGORIAS[selectedMed.categoria].label}
                </span>
                <span className="text-xs text-slate-500">{selectedMed.presentacion}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
              2 · Término de búsqueda (editable)
            </label>
            <div className="flex gap-2">
              <input
                type="search"
                value={queryInput}
                placeholder="Ej.: Moxifloxacino, Nitazoxanida, Enalapril…"
                onChange={(e) => {
                  setQueryInput(e.target.value);
                  if (medId) setMedId('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold rounded-lg transition shadow-sm whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {googleUrl && scholarUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-semibold rounded-lg transition"
              >
                <Globe className="w-4 h-4 text-blue-700" />
                Buscar precios en Google Guatemala
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-semibold rounded-lg transition"
              >
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                Buscar estudios en Google Scholar
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-relaxed">
            ⓘ La información proviene de DuckDuckGo (Wikipedia, Open data, fuentes abiertas) y de Google. Es
            orientativa; verificá siempre con tu agente de ventas o en la ficha técnica antes de cotizar.
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Buscando información…</p>
        </div>
      )}

      {!loading && result && (
        <SearchResults result={result} onRetry={handleSearch} queryInput={queryInput} />
      )}

      {!loading && !result && !error && (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h2 className="text-base font-bold text-slate-700">¿Cómo funciona?</h2>
          <ol className="text-sm text-slate-500 mt-3 space-y-2 max-w-md mx-auto text-left">
            <li>
              <span className="font-semibold text-slate-700">1.</span> Elegí un producto FarmaCarex o escribí el principio activo que te interese.
            </li>
            <li>
              <span className="font-semibold text-slate-700">2.</span> Tocá <strong>Buscar</strong> para consultar DuckDuckGo.
            </li>
            <li>
              <span className="font-semibold text-slate-700">3.</span> Usá los botones de Google para abrir búsquedas de precios o papers académicos.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: CompetenciaResult['source'] }) {
  const map: Record<CompetenciaResult['source'], { label: string; cls: string }> = {
    duckduckgo: { label: 'DuckDuckGo', cls: 'bg-orange-50 text-orange-700 ring-orange-200' },
    'wikipedia-es': { label: 'Wikipedia (es)', cls: 'bg-slate-100 text-slate-700 ring-slate-200' },
    'wikipedia-en': { label: 'Wikipedia (en)', cls: 'bg-slate-100 text-slate-700 ring-slate-200' },
    none: { label: 'Sin resultados', cls: 'bg-red-50 text-red-700 ring-red-200' },
  };
  const m = map[source];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ring-1 ${m.cls}`}>
      {m.label}
    </span>
  );
}

function SearchResults({
  result,
  onRetry,
  queryInput,
}: {
  result: CompetenciaResult;
  onRetry: (override: { query: string; medId?: string }) => void;
  queryInput: string;
}) {
  const empty = !result.abstract && result.topics.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-2">
            Fuente
            <SourceBadge source={result.source} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            “{result.query}”
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onRetry({ query: queryInput })}
          className="text-xs text-slate-500 hover:text-blue-700 font-semibold flex items-center gap-1"
        >
          <Search className="w-3.5 h-3.5" />
          Repetir búsqueda
        </button>
      </div>

      {empty ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-700 font-semibold">Sin resultados en DuckDuckGo</p>
          <p className="text-xs text-slate-500 mt-1">
            Probá con otro término o usá los botones de Google arriba para buscar precios o papers.
          </p>
        </div>
      ) : (
        <>
          {result.abstract && (
            <article className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
              <header className="flex items-start justify-between gap-3 mb-3">
                <div className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                  Resumen
                </div>
                {result.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt=""
                    className="w-12 h-12 object-contain bg-slate-50 rounded"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </header>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {result.abstract}
              </p>
              {result.abstractUrl && (
                <a
                  href={result.abstractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-700 hover:text-blue-900"
                >
                  Ver fuente
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </article>
          )}

          {result.topics.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                Temas relacionados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.topics.map((t, i) => (
                  <a
                    key={i}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition text-sm"
                  >
                    {t.iconUrl ? (
                      <img
                        src={t.iconUrl}
                        alt=""
                        className="w-4 h-4 mt-0.5 object-contain shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-slate-100 shrink-0" />
                    )}
                    <span className="text-slate-700 leading-snug line-clamp-3 flex-1">{t.text}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
