import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import { useRanked } from '../../context/RankedContext';
import { sounds } from '../../utils/audio';
import { todayKey } from '../../utils/memoryTools';
import {
  TESTS, TRACK_W, gradeFor, makeRound, scoreAngle, scoreCount, scoreSplit, scoreTempo, scoreTrack, xpFor,
  type Round, type TestId
} from '../../utils/gutCheck';

const KEY = 'ranked.gutcheck.v1';
interface Stats { dailyDone: string; best: number; plays: number }
const loadStats = (): Stats => {
  try {
    const p = JSON.parse(window.localStorage.getItem(KEY) || '{}') as Partial<Stats>;
    return { dailyDone: p.dailyDone || '', best: p.best || 0, plays: p.plays || 0 };
  } catch {
    return { dailyDone: '', best: 0, plays: 0 };
  }
};

const btn = 'min-h-touch px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-colors';
const primary = `${btn} mem-on border-transparent bg-zinc-950 text-white dark:bg-white dark:text-zinc-950`;
const ghost = `${btn} border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200`;
const stage = 'w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 touch-none select-none';

type Done = (score: number, detail: string) => void;
interface TestProps { round: Round; done: Done; finished: boolean }

/** Convert a pointer event to coordinates of the svg's viewBox. */
function toSvg(e: React.PointerEvent<SVGSVGElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const vb = e.currentTarget.viewBox.baseVal;
  return { x: ((e.clientX - r.left) / r.width) * vb.width, y: ((e.clientY - r.top) / r.height) * vb.height };
}

const CountTest: React.FC<TestProps> = ({ round, done, finished }) => {
  const [shown, setShown] = useState(true);
  const [guess, setGuess] = useState('');
  useEffect(() => { const t = setTimeout(() => setShown(false), 2000); return () => clearTimeout(t); }, []);
  const n = round.dots.length;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseInt(guess, 10);
    if (!Number.isFinite(g) || g < 0) return;
    done(scoreCount(g, n), `There were ${n} dots. You said ${g}.`);
  };
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 300 200" className={stage} role="img" aria-label={shown ? 'Dots' : 'Dots hidden'}>
        {(shown || finished) && round.dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="3.2" className="fill-zinc-900 dark:fill-zinc-100" />)}
      </svg>
      {!finished && (
        <form onSubmit={submit} className="flex gap-2">
          <input type="number" inputMode="numeric" min={0} disabled={shown} value={guess} onChange={(e) => setGuess(e.target.value)} aria-label="How many dots" placeholder={shown ? 'Look…' : 'How many?'} className="flex-1 min-h-touch px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm" />
          <button type="submit" disabled={shown || guess === ''} className={`${primary} disabled:opacity-50`}>Submit</button>
        </form>
      )}
    </div>
  );
};

const ballAt = (b: Round['ball'], t: number) => ({ x: b.x0 + b.vx * t, y: 190 - 4 * b.peak * t * (1 - t) });
const VANISH = 0.5;

const TrackTest: React.FC<TestProps> = ({ round, done, finished }) => {
  const [t, setT] = useState(0);
  const [mark, setMark] = useState<number | null>(null);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (now: number) => { const v = Math.min(1, (now - start) / 1600); setT(v); if (v < VANISH) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const truth = round.ball.x0 + round.ball.vx;
  const flying = t < VANISH;
  const b = ballAt(round.ball, t);
  const path = Array.from({ length: 21 }, (_, i) => { const p = ballAt(round.ball, i / 20); return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join(' ');
  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${TRACK_W} 200`}
        className={`${stage} ${!flying && !finished ? 'cursor-crosshair' : ''}`}
        role="img"
        aria-label="Ball flight. Tap the ground where it lands."
        onPointerDown={(e) => { if (!flying && !finished) setMark(Math.max(0, Math.min(TRACK_W, toSvg(e).x))); }}
      >
        <line x1="0" y1="190" x2={TRACK_W} y2="190" className="stroke-zinc-400" strokeWidth="2" />
        {flying && <circle cx={b.x} cy={b.y} r="7" className="fill-amber-500" />}
        {finished && <><path d={path} className="stroke-amber-500 fill-none" strokeDasharray="4 4" /><circle cx={truth} cy="190" r="6" className="fill-amber-500" /></>}
        {mark !== null && <line x1={mark} y1="176" x2={mark} y2="190" className="stroke-sky-500" strokeWidth="3" />}
      </svg>
      {!finished && (
        <button disabled={mark === null} onClick={() => done(scoreTrack(mark!, truth), `You were ${Math.round(Math.abs(mark! - truth))} units from the landing spot.`)} className={`${primary} w-full disabled:opacity-50`}>
          {flying ? 'Watch…' : mark === null ? 'Tap where it lands' : 'Lock in'}
        </button>
      )}
    </div>
  );
};

const AngleTest: React.FC<TestProps> = ({ round, done, finished }) => {
  const [deg, setDeg] = useState(0);
  const drag = useRef(false);
  const set = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toSvg(e);
    setDeg(Math.round((Math.atan2(p.x - 100, 100 - p.y) * 180) / Math.PI + 360) % 360);
  };
  const line = (a: number, len: number) => ({ x: 100 + len * Math.sin((a * Math.PI) / 180), y: 100 - len * Math.cos((a * Math.PI) / 180) });
  const tip = line(deg, 80); const goal = line(round.angle, 80);
  return (
    <div className="space-y-3">
      <p className="text-center text-3xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">{round.angle}°</p>
      <svg
        viewBox="0 0 200 200" className={`${stage} max-w-[260px] mx-auto block`} role="slider" aria-label="Angle" aria-valuemin={0} aria-valuemax={359} aria-valuenow={deg}
        onPointerDown={(e) => { if (finished) return; drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e); }}
        onPointerMove={(e) => { if (drag.current) set(e); }}
        onPointerUp={() => { drag.current = false; }}
      >
        <line x1="100" y1="100" x2="100" y2="20" className="stroke-zinc-400" strokeDasharray="4 4" />
        <line x1="100" y1="100" x2={tip.x} y2={tip.y} className="stroke-sky-500" strokeWidth="4" strokeLinecap="round" />
        <circle cx={tip.x} cy={tip.y} r="9" className="fill-sky-500" />
        {finished && <line x1="100" y1="100" x2={goal.x} y2={goal.y} className="stroke-amber-500" strokeWidth="3" />}
      </svg>
      {!finished && (
        <button onClick={() => done(scoreAngle(deg, round.angle), `Target ${round.angle}°. You set ${deg}°.`)} className={`${primary} w-full`}>Lock in {deg}°</button>
      )}
    </div>
  );
};

const BEATS = 4; const TAPS = 8;
const TempoTest: React.FC<TestProps> = ({ round, done, finished }) => {
  const [beat, setBeat] = useState(0);
  const [flash, setFlash] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const ctx = useRef<AudioContext | null>(null);
  const listening = beat < BEATS;
  const beep = () => {
    try {
      ctx.current = ctx.current ?? new AudioContext();
      const o = ctx.current.createOscillator(); const g = ctx.current.createGain();
      o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(ctx.current.destination);
      o.start(); o.stop(ctx.current.currentTime + 0.06);
    } catch { /* no audio: the flash still shows the beat */ }
  };
  const pulse = () => { setFlash(true); setTimeout(() => setFlash(false), 120); };
  const startListening = () => {
    for (let i = 0; i < BEATS; i++) setTimeout(() => { setBeat(i + 1); pulse(); beep(); }, 300 + i * round.gap);
  };
  const [started, setStarted] = useState(false);
  const tap = () => {
    if (listening || finished) return;
    const next = [...taps, performance.now()];
    setTaps(next);
    if (next.length === TAPS) {
      const r = scoreTempo(next, round.gap);
      done(r.score, `Target gap ${round.gap} ms. Your drift was ${Math.round(r.drift)} ms and jitter ${Math.round(r.jitter)} ms.`);
    }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); tap(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  return (
    <div className="space-y-3">
      <button
        onPointerDown={() => (started ? tap() : undefined)}
        onClick={() => { if (!started) { setStarted(true); startListening(); } }}
        aria-label={!started ? 'Start' : listening ? 'Listening' : 'Tap the beat'}
        className={`${stage} h-48 flex flex-col items-center justify-center gap-2 cursor-pointer ${flash ? '!bg-amber-400' : ''}`}
      >
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{!started ? 'Tap to start' : listening ? `Listen… ${beat}/${BEATS}` : finished ? 'Done' : `Keep the beat: ${taps.length}/${TAPS}`}</span>
        {started && !listening && !finished && <span className="text-xs text-zinc-500">Tap here or press Space. No sound now.</span>}
      </button>
    </div>
  );
};

const SplitTest: React.FC<TestProps> = ({ round, done, finished }) => {
  const [pos, setPos] = useState<number | null>(null);
  const drag = useRef(false);
  const set = (e: React.PointerEvent<SVGSVGElement>) => setPos(Math.round(Math.max(0, Math.min(100, ((toSvg(e).x - 20) / 260) * 100)) * 10) / 10);
  const X = (p: number) => 20 + (p / 100) * 260;
  return (
    <div className="space-y-3">
      <p className="text-center text-3xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">Mark {round.split.label}</p>
      <svg
        viewBox="0 0 300 80" className={stage} role="img" aria-label="Line to split"
        onPointerDown={(e) => { if (finished) return; drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e); }}
        onPointerMove={(e) => { if (drag.current) set(e); }}
        onPointerUp={() => { drag.current = false; }}
      >
        <line x1="20" y1="40" x2="280" y2="40" className="stroke-zinc-500" strokeWidth="4" strokeLinecap="round" />
        {pos !== null && <line x1={X(pos)} y1="22" x2={X(pos)} y2="58" className="stroke-sky-500" strokeWidth="4" />}
        {finished && <line x1={X(round.split.pct)} y1="16" x2={X(round.split.pct)} y2="64" className="stroke-amber-500" strokeWidth="4" />}
      </svg>
      {!finished && (
        <button disabled={pos === null} onClick={() => done(scoreSplit(pos!, round.split.pct), `Target ${round.split.pct}%. You marked ${Math.round(pos!)}%.`)} className={`${primary} w-full disabled:opacity-50`}>
          {pos === null ? 'Tap or drag on the line' : 'Lock in'}
        </button>
      )}
    </div>
  );
};

const VIEWS: Record<TestId, React.FC<TestProps>> = { count: CountTest, track: TrackTest, angle: AngleTest, tempo: TempoTest, split: SplitTest };

type Mode = 'daily' | 'free';
export const GutCheckGame: React.FC = () => {
  const { gainXp } = useRanked();
  const [stats, setStats] = useState(loadStats);
  const [run, setRun] = useState<{ mode: Mode; seed: number } | null>(null);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [detail, setDetail] = useState('');
  const round = useMemo(() => (run ? makeRound(run.seed) : null), [run]);

  const dailyDone = stats.dailyDone === todayKey();
  const start = (mode: Mode) => {
    setRun({ mode, seed: mode === 'daily' ? parseInt(todayKey().replace(/-/g, ''), 10) : Date.now() % 2147483647 });
    setIdx(0); setScores([]); setDetail('');
  };
  const finished = detail !== '';
  const summary = run !== null && idx >= TESTS.length;
  const [earned, setEarned] = useState(0);

  const done: Done = (score, text) => { sounds.playClick(); setScores((s) => [...s, score]); setDetail(text); };
  const next = () => { setDetail(''); setIdx((i) => i + 1); };

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  useEffect(() => {
    if (!run || !summary) return;
    const xp = xpFor(avg, run.mode === 'daily' && !dailyDone);
    setEarned(xp);
    gainXp(xp, 'iq', `Gut Check ${run.mode === 'daily' ? 'Daily ' : ''}[${gradeFor(avg)}]`);
    const nextStats = { dailyDone: run.mode === 'daily' ? todayKey() : stats.dailyDone, best: Math.max(stats.best, avg), plays: stats.plays + 1 };
    setStats(nextStats);
    try { window.localStorage.setItem(KEY, JSON.stringify(nextStats)); } catch { /* stats are best effort */ }
    if (avg >= 85) confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  if (!run || !round) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">Gut Check</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Five quick tests of your senses, each scored 0 to 100. Count, Track, Angle, Tempo and Split.</p>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
          {TESTS.map((t) => <li key={t.id}><b>{t.title}</b>: {t.how}</li>)}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => start('daily')} className={primary}>Daily run{dailyDone ? ' (played, no bonus)' : ' (2x XP)'}</button>
          <button onClick={() => start('free')} className={ghost}>Free play</button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Best average {stats.best} · Runs {stats.plays}. The daily run is the same for everyone today.</p>
      </div>
    );
  }

  if (summary) {
    return (
      <div className="space-y-4 text-center">
        <Trophy className="w-10 h-10 mx-auto text-amber-500" />
        <p className="text-5xl font-black font-['Outfit'] text-zinc-900 dark:text-zinc-100">{gradeFor(avg)}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Average <b>{avg}</b> / 100 · +{earned.toLocaleString()} XP</p>
        <ul className="text-sm text-zinc-600 dark:text-zinc-300 space-y-0.5">{TESTS.map((t, i) => <li key={t.id}>{t.title}: <b>{scores[i]}</b></li>)}</ul>
        <div className="flex justify-center gap-2">
          <button onClick={() => start('free')} className={primary}>Play again</button>
          <button onClick={() => setRun(null)} className={ghost}>Menu</button>
        </div>
      </div>
    );
  }

  const test = TESTS[idx];
  const View = VIEWS[test.id];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
        <span>{run.mode === 'daily' ? 'Daily' : 'Free play'} · Test {idx + 1} of {TESTS.length}</span>
        <span>{scores.length ? `Avg ${avg}` : ''}</span>
      </div>
      <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">{test.title}</h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{test.how}</p>
      <View key={idx} round={round} done={done} finished={finished} />
      {finished && (
        <div className="space-y-2" role="status">
          <p className="text-sm text-zinc-700 dark:text-zinc-200"><b>{scores[idx]} / 100</b>. {detail}</p>
          <button onClick={() => (idx === TESTS.length - 1 ? setIdx(TESTS.length) : next())} className={`${primary} w-full`}>{idx === TESTS.length - 1 ? 'See result' : 'Next test'}</button>
        </div>
      )}
    </div>
  );
};
