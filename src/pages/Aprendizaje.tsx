import { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  Check,
  X,
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  useLearningStore,
  type DayResult,
} from '../store/learningStore';
import {
  getDailyQuestions,
  QUESTION_TYPE_LABEL,
  type Question,
} from '../lib/quiz';
import { todayISO } from '../lib/currency';

interface SessionState {
  questions: Question[];
  index: number;
  selected: string | null;
  answered: boolean;
  answers: { questionId: string; correct: boolean }[];
  finished: boolean;
  mode: 'daily' | 'free';
}

const ENCOURAGEMENT = [
  'Excelente trabajo.',
  'Vas muy bien, mantené el ritmo.',
  'Conocimiento sólido. Seguí así.',
  'Cada día un paso más.',
  'Aprendizaje constante.',
];

export default function Aprendizaje() {
  const todayView = useLearningStore((s) => s.todayView);
  const recordDay = useLearningStore((s) => s.recordDay);
  const reset = useLearningStore((s) => s.reset);
  const freeQuestionsFn = useLearningStore((s) => s.freeQuestions);
  const streak = useLearningStore((s) => s.streak);
  const bestStreak = useLearningStore((s) => s.bestStreak);
  const totalAnswered = useLearningStore((s) => s.totalAnswered);
  const totalCorrect = useLearningStore((s) => s.totalCorrect);
  const recent = useLearningStore((s) => s.recent);

  const [session, setSession] = useState<SessionState | null>(null);

  const today = useMemo(() => todayView(), [todayView]);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const startDaily = () => {
    const questions = today.questions.length > 0 ? today.questions : getDailyQuestions(today.date, 5);
    setSession({
      questions,
      index: 0,
      selected: null,
      answered: false,
      answers: [],
      finished: false,
      mode: 'daily',
    });
  };

  const startFree = () => {
    const questions = freeQuestionsFn(5);
    setSession({
      questions,
      index: 0,
      selected: null,
      answered: false,
      answers: [],
      finished: false,
      mode: 'free',
    });
  };

  const handleSelect = (key: string) => {
    if (!session || session.answered) return;
    const q = session.questions[session.index];
    const correct = key === q.correctKey;
    setSession((s) =>
      s
        ? {
            ...s,
            selected: key,
            answered: true,
            answers: [...s.answers, { questionId: q.id, correct }],
          }
        : s
    );
  };

  const handleNext = () => {
    setSession((s) => {
      if (!s) return s;
      const next = s.index + 1;
      if (next >= s.questions.length) {
        const result: DayResult = {
          date: today.date,
          total: s.questions.length,
          correct: s.answers.filter((a) => a.correct).length,
          details: s.answers,
        };
        if (s.mode === 'daily') {
          recordDay(result);
        }
        return { ...s, finished: true };
      }
      return { ...s, index: next, selected: null, answered: false };
    });
  };

  const closeSession = () => setSession(null);

  // Si ya practicó hoy, mostramos un resumen inicial cuando entra al daily
  useEffect(() => {
    if (!session && today.alreadyDone && today.result) {
      // no auto-inicia, el usuario debe tocar "Practicar más" o "Iniciar práctica"
    }
    return;
  }, [today.alreadyDone, today.result, session]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Aprendizaje
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cinco preguntas diarias para dominar el catálogo FarmaCarex.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Reiniciar racha y progreso? Esta acción no se puede deshacer.')) {
              reset();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar progreso
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          color="orange"
          label="Racha actual"
          value={`${streak}`}
          sub={streak === 1 ? 'día' : 'días'}
        />
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          color="amber"
          label="Mejor racha"
          value={`${bestStreak}`}
          sub={bestStreak === 1 ? 'día' : 'días'}
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          color="indigo"
          label="Preguntas"
          value={`${totalAnswered}`}
          sub="respondidas"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5" />}
          color="emerald"
          label="Precisión"
          value={`${accuracy}%`}
          sub={`${totalCorrect} correctas`}
        />
      </div>

      {!session && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          {today.alreadyDone && today.result ? (
            <CompletedCard result={today.result} onPracticeMore={startFree} />
          ) : (
            <DailyStartCard onStart={startDaily} />
          )}

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              Modo libre
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Practicá sin afectar tu racha. Genera 5 preguntas nuevas al azar cada vez.
            </p>
            <button
              type="button"
              onClick={startFree}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-semibold rounded-lg transition"
            >
              <Brain className="w-4 h-4 text-blue-700" />
              Practicar 5 preguntas al azar
            </button>
          </div>

          {recent.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Últimos días
              </h2>
              <div className="space-y-2">
                {recent.slice(0, 7).map((r) => (
                  <div
                    key={r.date}
                    className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm"
                  >
                    <span className="font-medium text-slate-700">{r.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">
                        {r.correct}/{r.total}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {Math.round((r.correct / r.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {session && !session.finished && (
        <QuestionCard
          question={session.questions[session.index]}
          index={session.index}
          total={session.questions.length}
          mode={session.mode}
          selected={session.selected}
          answered={session.answered}
          onSelect={handleSelect}
          onNext={handleNext}
          onCancel={closeSession}
        />
      )}

      {session && session.finished && (
        <ResultsCard
          session={session}
          mode={session.mode}
          encouragement={
            ENCOURAGEMENT[
              Math.floor((session.answers.filter((a) => a.correct).length / session.questions.length) * (ENCOURAGEMENT.length - 1))
            ] ?? ENCOURAGEMENT[0]
          }
          onRetry={() => {
            if (session.mode === 'free') startFree();
            else startDaily();
          }}
          onDone={closeSession}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: 'orange' | 'amber' | 'indigo' | 'emerald';
}) {
  const palette: Record<string, { bg: string; text: string }> = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };
  const p = palette[color];
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className={`w-9 h-9 rounded-lg ${p.bg} ${p.text} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-tight">
        {label}
      </div>
      <div className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  );
}

function DailyStartCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-xl shadow-md">
      <div>
        <div className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">
          Práctica diaria · {todayISO()}
        </div>
        <h2 className="text-2xl font-extrabold">¿Listo para tus 5 preguntas de hoy?</h2>
        <p className="text-sm opacity-80 mt-1 max-w-md">
          Mezclamos preguntas de categoría, principio activo, indicación, mecanismo de acción y contraindicaciones.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-blue-800 font-bold rounded-lg transition shadow-sm whitespace-nowrap"
      >
        Iniciar práctica del día
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CompletedCard({
  result,
  onPracticeMore,
}: {
  result: DayResult;
  onPracticeMore: () => void;
}) {
  const pct = Math.round((result.correct / result.total) * 100);
  const tone =
    pct >= 80 ? 'from-emerald-700 to-emerald-800' : pct >= 50 ? 'from-blue-700 to-blue-800' : 'from-amber-700 to-amber-800';
  return (
    <div className={`p-5 bg-gradient-to-br ${tone} text-white rounded-xl shadow-md`}>
      <div className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">
        Práctica de hoy · {result.date}
      </div>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-extrabold">{result.correct}/{result.total}</span>
        <span className="text-lg opacity-80">{pct}% correctas</span>
      </div>
      <p className="text-sm opacity-80 mb-3">
        {pct >= 80
          ? 'Excelente. Mantenés la racha activa.'
          : pct >= 50
            ? 'Buen trabajo. Practicá más para afianzar.'
            : 'Repasá las fichas técnicas y volvé mañana.'}
      </p>
      <button
        type="button"
        onClick={onPracticeMore}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-lg transition text-sm"
      >
        <Brain className="w-4 h-4" />
        Practicar más (modo libre)
      </button>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  total,
  mode,
  selected,
  answered,
  onSelect,
  onNext,
  onCancel,
}: {
  question: Question;
  index: number;
  total: number;
  mode: 'daily' | 'free';
  selected: string | null;
  answered: boolean;
  onSelect: (key: string) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const isCorrect = selected === question.correctKey;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4 text-xs uppercase font-bold tracking-wider">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-slate-900">
            Pregunta {index + 1}/{total}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-blue-700">{QUESTION_TYPE_LABEL[question.type]}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          {mode === 'free' && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Modo libre
            </span>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-500 hover:text-red-600 font-semibold"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mb-2 text-[11px] uppercase tracking-wider font-bold text-slate-400">
        {question.medName}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-snug">
        {question.prompt}
      </h2>

      <div className="space-y-2.5">
        {question.options.map((opt) => {
          const isSelected = selected === opt.key;
          const isAnswer = opt.key === question.correctKey;
          let stateClass = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-800';
          if (answered) {
            if (isAnswer) {
              stateClass = 'border-emerald-500 bg-emerald-50 text-emerald-900';
            } else if (isSelected) {
              stateClass = 'border-red-400 bg-red-50 text-red-900';
            } else {
              stateClass = 'border-slate-200 bg-slate-50 text-slate-500 opacity-70';
            }
          } else if (isSelected) {
            stateClass = 'border-blue-500 bg-blue-50 text-blue-900';
          }
          return (
            <button
              key={opt.key}
              type="button"
              disabled={answered}
              onClick={() => onSelect(opt.key)}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 transition ${stateClass}`}
            >
              <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                {String.fromCharCode(65 + question.options.indexOf(opt))}
              </span>
              <span className="flex-1 text-sm leading-snug">{opt.label}</span>
              {answered && isAnswer && (
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {answered && isSelected && !isAnswer && (
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-5 rounded-xl p-4 border ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div
            className={`text-sm font-bold mb-1 ${
              isCorrect ? 'text-emerald-800' : 'text-red-800'
            }`}
          >
            {isCorrect ? '¡Correcto!' : 'No era esa. La respuesta correcta:'}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition"
            >
              {index + 1 >= total ? 'Ver resultados' : 'Siguiente pregunta'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsCard({
  session,
  mode,
  encouragement,
  onRetry,
  onDone,
}: {
  session: SessionState;
  mode: 'daily' | 'free';
  encouragement: string;
  onRetry: () => void;
  onDone: () => void;
}) {
  const correct = session.answers.filter((a) => a.correct).length;
  const total = session.questions.length;
  const pct = Math.round((correct / total) * 100);
  const tone =
    pct >= 80 ? 'from-emerald-700 to-emerald-800' : pct >= 50 ? 'from-blue-700 to-blue-800' : 'from-amber-700 to-amber-800';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      <div className={`p-6 sm:p-8 bg-gradient-to-br ${tone} text-white`}>
        <div className="text-xs uppercase font-bold tracking-wider opacity-80 mb-1">
          {mode === 'daily' ? 'Práctica diaria completada' : 'Modo libre'}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
          {correct} / {total}
        </h2>
        <p className="text-lg opacity-90 mb-1">{pct}% correctas</p>
        <p className="text-sm opacity-80">{encouragement}</p>
      </div>

      <div className="p-5 sm:p-8 space-y-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Revisión
          </h3>
          <div className="space-y-2">
            {session.questions.map((q, i) => {
              const ans = session.answers[i];
              const ok = ans?.correct ?? false;
              return (
                <div
                  key={q.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      ok ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {ok ? '✓' : '✗'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
                      {q.medName} · {QUESTION_TYPE_LABEL[q.type]}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {q.prompt}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Respuesta correcta:{' '}
                      <span className="font-semibold">
                        {q.options.find((o) => o.key === q.correctKey)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            {mode === 'free' ? 'Otra ronda libre' : 'Practicar más'}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
