import { MEDICATIONS } from '../data/medications';
import { CATEGORIAS } from '../types';
import type { Medication } from '../types';

export type QuestionType =
  | 'categoria'
  | 'principio'
  | 'indicacion'
  | 'mecanismo'
  | 'contraindicacion'
  | 'presentacion';

export interface QuestionOption {
  key: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options: QuestionOption[];
  correctKey: string;
  explanation: string;
  medId: string;
  medName: string;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function truncate(s: string | undefined, max = 160): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 3).trimEnd() + '…';
}

function shuffleOptions(
  correct: string,
  distractors: string[],
  seed: number
): { options: QuestionOption[]; correctKey: string } {
  const all = [correct, ...distractors];
  const shuffled = seededShuffle(all, seed);
  const correctIdx = shuffled.indexOf(correct);
  const correctKey = `opt-${correctIdx}`;
  const options = shuffled.map((label, i) => ({ key: `opt-${i}`, label }));
  return { options, correctKey };
}

function buildQuestionsFor(med: Medication): Question[] {
  const qs: Question[] = [];
  const catLabel = CATEGORIAS[med.categoria].label;

  // 1) Categoría
  if (med.categoria) {
    const allCats = Object.values(CATEGORIAS).map((c) => c.label);
    const distractors = allCats.filter((c) => c !== catLabel);
    const seed = hashString(med.id + ':cat');
    const wrong = seededShuffle(distractors, seed).slice(0, 3);
    const { options, correctKey } = shuffleOptions(catLabel, wrong, seed);
    qs.push({
      id: `${med.id}:cat`,
      type: 'categoria',
      prompt: `¿A qué categoría terapéutica pertenece ${med.nombreComercial}?`,
      options,
      correctKey,
      explanation: `${med.nombreComercial} pertenece a la categoría "${catLabel}".`,
      medId: med.id,
      medName: med.nombreComercial,
    });
  }

  // 2) Principio activo
  if (med.principioActivo) {
    const allPA = Array.from(
      new Set(MEDICATIONS.map((m) => m.principioActivo).filter(Boolean) as string[])
    );
    const distractors = allPA.filter((p) => p !== med.principioActivo);
    if (distractors.length >= 3) {
      const seed = hashString(med.id + ':pa');
      const wrong = seededShuffle(distractors, seed).slice(0, 3);
      const { options, correctKey } = shuffleOptions(med.principioActivo, wrong, seed);
      qs.push({
        id: `${med.id}:pa`,
        type: 'principio',
        prompt: `¿Cuál es el principio activo principal de ${med.nombreComercial}?`,
        options,
        correctKey,
        explanation: `El principio activo de ${med.nombreComercial} es ${med.principioActivo}.`,
        medId: med.id,
        medName: med.nombreComercial,
      });
    }
  }

  // 3) Indicaciones
  if (med.indicaciones && med.indicaciones.length > 30) {
    const allInd = MEDICATIONS.filter((m) => m.id !== med.id && m.indicaciones);
    if (allInd.length >= 3) {
      const seed = hashString(med.id + ':ind');
      const shuffled = seededShuffle(allInd, seed).slice(0, 3);
      const distractors = shuffled.map((m) => truncate(m.indicaciones, 110));
      const correctText = truncate(med.indicaciones, 110);
      const { options, correctKey } = shuffleOptions(correctText, distractors, seed);
      qs.push({
        id: `${med.id}:ind`,
        type: 'indicacion',
        prompt: `¿Cuál de estas descripciones corresponde a las indicaciones de ${med.nombreComercial}?`,
        options,
        correctKey,
        explanation: `${med.nombreComercial} está indicado para: ${truncate(med.indicaciones, 220)}`,
        medId: med.id,
        medName: med.nombreComercial,
      });
    }
  }

  // 4) Mecanismo de acción (solo si existe)
  if (med.mecanismoAccion && med.mecanismoAccion.length > 30) {
    const allMec = MEDICATIONS.filter((m) => m.id !== med.id && m.mecanismoAccion);
    if (allMec.length >= 3) {
      const seed = hashString(med.id + ':mec');
      const shuffled = seededShuffle(allMec, seed).slice(0, 3);
      const distractors = shuffled.map((m) => truncate(m.mecanismoAccion, 110));
      const correctText = truncate(med.mecanismoAccion, 110);
      const { options, correctKey } = shuffleOptions(correctText, distractors, seed);
      qs.push({
        id: `${med.id}:mec`,
        type: 'mecanismo',
        prompt: `¿Cuál es el mecanismo de acción de ${med.nombreComercial}?`,
        options,
        correctKey,
        explanation: `Mecanismo: ${truncate(med.mecanismoAccion, 220)}`,
        medId: med.id,
        medName: med.nombreComercial,
      });
    }
  }

  // 5) Contraindicaciones (solo si existe)
  if (med.contraindicaciones && med.contraindicaciones.length > 30) {
    const allCon = MEDICATIONS.filter((m) => m.id !== med.id && m.contraindicaciones);
    if (allCon.length >= 3) {
      const seed = hashString(med.id + ':con');
      const shuffled = seededShuffle(allCon, seed).slice(0, 3);
      const distractors = shuffled.map((m) => truncate(m.contraindicaciones, 110));
      const correctText = truncate(med.contraindicaciones, 110);
      const { options, correctKey } = shuffleOptions(correctText, distractors, seed);
      qs.push({
        id: `${med.id}:con`,
        type: 'contraindicacion',
        prompt: `¿Cuáles son las contraindicaciones principales de ${med.nombreComercial}?`,
        options,
        correctKey,
        explanation: `Contraindicaciones: ${truncate(med.contraindicaciones, 220)}`,
        medId: med.id,
        medName: med.nombreComercial,
      });
    }
  }

  // 6) Presentación
  if (med.presentacion && med.presentacion.length > 5) {
    const allPres = MEDICATIONS.filter((m) => m.id !== med.id && m.presentacion);
    if (allPres.length >= 3) {
      const seed = hashString(med.id + ':pres');
      const shuffled = seededShuffle(allPres, seed).slice(0, 3);
      const distractors = shuffled.map((m) => m.presentacion);
      const { options, correctKey } = shuffleOptions(med.presentacion, distractors, seed);
      qs.push({
        id: `${med.id}:pres`,
        type: 'presentacion',
        prompt: `¿Cuál es la presentación de ${med.nombreComercial}?`,
        options,
        correctKey,
        explanation: `${med.nombreComercial} se presenta como: ${med.presentacion}.`,
        medId: med.id,
        medName: med.nombreComercial,
      });
    }
  }

  return qs;
}

let _pool: Question[] | null = null;
let _poolVersion = 0;

export function getQuestionPool(): Question[] {
  if (_pool) return _pool;
  const pool: Question[] = [];
  for (const m of MEDICATIONS) {
    pool.push(...buildQuestionsFor(m));
  }
  _pool = pool;
  _poolVersion++;
  return pool;
}

export function getPoolStats(): { total: number; byType: Record<QuestionType, number> } {
  const pool = getQuestionPool();
  const byType: Record<QuestionType, number> = {
    categoria: 0,
    principio: 0,
    indicacion: 0,
    mecanismo: 0,
    contraindicacion: 0,
    presentacion: 0,
  };
  for (const q of pool) byType[q.type]++;
  return { total: pool.length, byType };
}

export function getDailyQuestions(dateStr: string, count = 5): Question[] {
  const pool = getQuestionPool();
  if (pool.length === 0) return [];
  const seed = hashString('daily:' + dateStr + ':v' + _poolVersion);
  return seededShuffle(pool, seed).slice(0, count);
}

export function getFreeQuestions(count = 5): Question[] {
  const pool = getQuestionPool();
  if (pool.length === 0) return [];
  const seed = hashString('free:' + Date.now().toString(36));
  return seededShuffle(pool, seed).slice(0, count);
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  categoria: 'Categoría',
  principio: 'Principio activo',
  indicacion: 'Indicación',
  mecanismo: 'Mecanismo',
  contraindicacion: 'Contraindicación',
  presentacion: 'Presentación',
};
