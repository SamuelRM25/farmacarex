import type { Categoria } from '../types';

const DDG_ENDPOINT = 'https://api.duckduckgo.com/';
const WIKI_ES_ENDPOINT = 'https://es.wikipedia.org/api/rest_v1/page/summary/';
const WIKI_EN_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export interface CompetenciaTopic {
  text: string;
  url: string;
  iconUrl?: string;
}

export interface CompetenciaResult {
  query: string;
  abstract: string;
  abstractUrl: string;
  imageUrl?: string;
  topics: CompetenciaTopic[];
  source: 'duckduckgo' | 'wikipedia-es' | 'wikipedia-en' | 'none';
}

interface DDGResponse {
  Abstract?: string;
  AbstractURL?: string;
  AbstractText?: string;
  Image?: string;
  ImageIsLogo?: boolean;
  RelatedTopics?: Array<{
    Text?: string;
    FirstURL?: string;
    Result?: string;
    Icon?: { URL?: string };
    Topics?: Array<{
      Text?: string;
      FirstURL?: string;
      Icon?: { URL?: string };
    }>;
  }>;
}

interface WikiSummary {
  type?: string;
  title?: string;
  extract?: string;
  thumbnail?: { source?: string; width?: number; height?: number };
  content_urls?: {
    desktop?: { page?: string };
    mobile?: { page?: string };
  };
}

function flattenRelatedTopics(input: DDGResponse['RelatedTopics']): CompetenciaTopic[] {
  if (!input) return [];
  const out: CompetenciaTopic[] = [];
  for (const t of input) {
    if (typeof t.Text === 'string' && t.Text.length > 0 && typeof t.FirstURL === 'string') {
      out.push({
        text: t.Text,
        url: t.FirstURL,
        iconUrl: t.Icon?.URL,
      });
    }
    if (Array.isArray(t.Topics)) {
      for (const sub of t.Topics) {
        if (typeof sub.Text === 'string' && sub.Text.length > 0 && typeof sub.FirstURL === 'string') {
          out.push({
            text: sub.Text,
            url: sub.FirstURL,
            iconUrl: sub.Icon?.URL,
          });
        }
      }
    }
  }
  return out;
}

function categoryContext(cat: Categoria | undefined): string {
  switch (cat) {
    case 'antibiotico':
      return 'antibiótico';
    case 'dolor':
      return 'analgésico';
    case 'vitaminas':
      return 'suplemento';
    case 'gastro':
      return 'medicamento';
    case 'alergia':
      return 'antihistamínico';
    case 'gripe-tos':
      return 'antitusivo';
    case 'ginecologia':
      return 'medicamento';
    case 'antiparasitario':
      return 'antiparasitario';
    case 'cuidado-bebe':
      return 'pediatría';
    case 'dispositivo':
      return 'producto';
    default:
      return 'medicamento';
  }
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function tryDDG(query: string): Promise<CompetenciaResult | null> {
  const url = `${DDG_ENDPOINT}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const data = await fetchJSON<DDGResponse>(url);
  if (!data) return null;
  const abstract = data.AbstractText ?? data.Abstract ?? '';
  const abstractUrl = data.AbstractURL ?? '';
  const topics = flattenRelatedTopics(data.RelatedTopics);
  if (!abstract && topics.length === 0) return null;
  return {
    query,
    abstract,
    abstractUrl,
    imageUrl: data.Image && !data.ImageIsLogo ? data.Image : undefined,
    topics: topics.slice(0, 8),
    source: 'duckduckgo',
  };
}

async function tryWiki(endpoint: string, term: string): Promise<CompetenciaResult | null> {
  const url = `${endpoint}${encodeURIComponent(term.replace(/\s+/g, '_'))}`;
  const data = await fetchJSON<WikiSummary>(url);
  if (!data || data.type === 'disambiguation' || !data.extract) return null;
  return {
    query: term,
    abstract: data.extract,
    abstractUrl: data.content_urls?.desktop?.page ?? '',
    imageUrl: data.thumbnail?.source,
    topics: [],
    source: endpoint.includes('/es.') ? 'wikipedia-es' : 'wikipedia-en',
  };
}

function tryCapitalize(term: string): string {
  return term
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function searchCompetencia(
  query: string,
  categoria?: Categoria
): Promise<CompetenciaResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: '',
      abstract: '',
      abstractUrl: '',
      topics: [],
      source: 'none',
    };
  }

  const ctx = categoria ? categoryContext(categoria) : '';
  const fullQuery = ctx ? `${trimmed} ${ctx}` : trimmed;

  // 1) DDG con contexto
  const ddg1 = await tryDDG(fullQuery);
  if (ddg1) return ddg1;

  // 2) DDG sin contexto
  const ddg2 = await tryDDG(trimmed);
  if (ddg2) return ddg2;

  // 3) Wikipedia Español
  const wikiEs = await tryWiki(WIKI_ES_ENDPOINT, tryCapitalize(trimmed));
  if (wikiEs) return wikiEs;

  // 4) Wikipedia Inglés (por si el término está solo en inglés)
  const wikiEn = await tryWiki(WIKI_EN_ENDPOINT, tryCapitalize(trimmed));
  if (wikiEn) return wikiEn;

  return {
    query: fullQuery,
    abstract: '',
    abstractUrl: '',
    topics: [],
    source: 'none',
  };
}

export function googleSearchUrl(query: string, ctx?: string): string {
  const parts = [query];
  if (ctx) parts.push(ctx);
  parts.push('precio');
  parts.push('Guatemala');
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(' '))}`;
}

export function googleScholarUrl(query: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}
