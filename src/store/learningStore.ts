import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { todayISO } from '../lib/currency';
import { getDailyQuestions, getFreeQuestions, type Question } from '../lib/quiz';

export interface DayResult {
  date: string;
  correct: number;
  total: number;
  details: { questionId: string; correct: boolean }[];
}

interface LearningState {
  lastPracticedDate: string | null;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  recent: DayResult[];

  todayView: () => {
    date: string;
    questions: Question[];
    alreadyDone: boolean;
    result: DayResult | undefined;
  };
  freeQuestions: (count?: number) => Question[];
  recordDay: (result: DayResult) => void;
  reset: () => void;
}

function yesterdayOf(date: string): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      lastPracticedDate: null,
      streak: 0,
      bestStreak: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      recent: [],

      todayView: () => {
        const date = todayISO();
        const state = get();
        const questions = getDailyQuestions(date, 5);
        const result = state.recent.find((r) => r.date === date);
        const alreadyDone = state.lastPracticedDate === date;
        return { date, questions, alreadyDone, result };
      },

      freeQuestions: (count = 5) => getFreeQuestions(count),

      recordDay: (result) => {
        const state = get();
        const existing = state.recent.find((r) => r.date === result.date);
        if (existing) {
          const totalAnswered =
            state.totalAnswered - existing.total + result.total;
          const totalCorrect = state.totalCorrect - existing.correct + result.correct;
          set({
            totalAnswered,
            totalCorrect,
            recent: [result, ...state.recent.filter((r) => r.date !== result.date)].slice(0, 30),
          });
          return;
        }
        const yesterday = yesterdayOf(result.date);
        const continued = state.lastPracticedDate === yesterday;
        const newStreak = continued ? state.streak + 1 : 1;
        set({
          lastPracticedDate: result.date,
          streak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          totalAnswered: state.totalAnswered + result.total,
          totalCorrect: state.totalCorrect + result.correct,
          recent: [result, ...state.recent].slice(0, 30),
        });
      },

      reset: () =>
        set({
          lastPracticedDate: null,
          streak: 0,
          bestStreak: 0,
          totalAnswered: 0,
          totalCorrect: 0,
          recent: [],
        }),
    }),
    {
      name: 'farmacarex:learning',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
