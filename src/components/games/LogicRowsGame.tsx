import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lightbulb, RotateCcw, Timer, Trophy } from 'lucide-react';
import { useRanked } from '../../context/RankedContext';
import { sounds } from '../../utils/audio';
import { todayKey } from '../../utils/memoryTools';
import { LEVELS, ROW_COLORS, clueText, holds, makePuzzle, type Level, type Puzzle } from '../../utils/logicRows';

type Mode = 'classic' | 'daily' | 'sprint' | 'ladder' | 'strict';
const LADDER: Level[] = ['starter', 'easy', 'medium', 'hard', 'expert', 'master'];
const LADDER_BONUS = 5000;
const STRICT_MULT = 2;
const STRICT_CHECKS = 3;
const MODE_LABEL: Record<Mode, string> = { classic: 'Classic', daily: 'Daily', sprint: 'Sprint', ladder: 'Ladder', strict: 'Strict' };
const SPRINT_SECONDS = 180;
const SPRINT_XP = 500;
const DAILY_MULT = 2;
const KEY = 'ranked.logicrows.v1';

interface Stats {
  dailyDone: string;
  bestSprint: number;
  solved: number;
}
const loadStats = (): Stats => {
  try {
    const p = JSON.parse(window.localStorage.getItem(KEY) || '{}') as Partial<Stats>;
    return { dailyDone: p.dailyDone || '', bestSprint: p.bestSprint || 0, solved: p.solved || 0 };
  } catch {
    return { dailyDone: '', bestSprint: 0, solved: 0 };
  }
};

const dailySeed = () => parseInt(todayKey().replace(/-/g, ''), 10);
const chip =
  'min-h-touch px-3.5 rounded-xl border text-sm font-semibold cursor-pointer transition-colors';
const idle = 'border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10';
const on = 'mem-on border-transparent bg-zinc-950 text-white dark:bg-white dark:text-zinc-950';

export const LogicRowsGame: React.FC = () => {
  const { gainXp, showToast } = useRanked();
  const [stats, setStats] = useState<Stats>(loadStats);
  const [mode, setMode] = useState<Mode>('classic');
  const [level, setLevel] = useState<Level>('easy');
  const [puzzle, setPuzzle] = useState<Puzzle>(() => makePuzzle('easy', Date.now()));
  const [placed, setPlaced] = useState<Array<number | null>>(() => Array(4).fill(null));
  const [sel, setSel] = useState(0);
  const [struck, setStruck] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [hints, setHints] = useState(0);
  const [solved, setSolved] = useState(false);
  const [left, setLeft] = useState(SPRINT_SECONDS);
  const [run, setRun] = useState<'idle' | 'going' | 'over'>('idle');
  const [sprintSolved, setSprintSolved] = useState(0);
  const sprintRef = useRef(0);
  const [rung, setRung] = useState(0);
  const [checks, setChecks] = useState(STRICT_CHECKS);

  const save = (patch: Partial<Stats>) =>
    setStats((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const load = (p: Puzzle) => {
    setPuzzle(p);
    setPlaced(Array(p.items.length).fill(null));
    setSel(0);
    setStruck([]);
    setWrong([]);
    setHints(0);
    setSolved(false);
  };

  const start = (m: Mode, lvl: Level = level) => {
    setMode(m);
    if (m === 'daily') load(makePuzzle('hard', dailySeed()));
    else if (m === 'sprint') {
      sprintRef.current = 0;
      setSprintSolved(0);
      setLeft(SPRINT_SECONDS);
      setRun('going');
      load(makePuzzle('easy', Date.now()));
    } else if (m === 'ladder') {
      setRung(0);
      load(makePuzzle(LADDER[0], Date.now()));
    } else {
      setLevel(lvl);
      setChecks(STRICT_CHECKS);
      load(makePuzzle(lvl, Date.now()));
    }
    if (m !== 'sprint') setRun('idle');
  };

  // Sprint clock
  useEffect(() => {
    if (mode !== 'sprint' || run !== 'going') return;
    if (left <= 0) {
      setRun('over');
      const n = sprintRef.current;
      if (n > 0) {
        gainXp(n * SPRINT_XP, 'iq', `Logic Rows Sprint: ${n} solved`);
        if (n > stats.bestSprint) save({ bestSprint: n });
      }
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mode, run, left]); // eslint-disable-line react-hooks/exhaustive-deps

  const names = puzzle.items;
  const rowName = (r: number) => ROW_COLORS[puzzle.rows[r]].name;
  const clues = useMemo(() => puzzle.clues.map((c) => clueText(c, (i) => names[i], rowName)), [puzzle]); // eslint-disable-line react-hooks/exhaustive-deps
  const used = new Set(placed.filter((p): p is number => p !== null));
  const full = placed.every((p) => p !== null);

  const put = (item: number) => {
    if (solved || used.has(item)) return;
    sounds.playClick();
    const target = placed[sel] === null ? sel : placed.findIndex((p) => p === null);
    if (target === -1) return;
    const copy = placed.slice();
    copy[target] = item;
    setPlaced(copy);
    setWrong([]);
    const nextEmpty = copy.findIndex((p) => p === null);
    setSel(nextEmpty === -1 ? target : nextEmpty);
  };

  const finish = () => {
    sounds.playSuccess();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setSolved(true);
    save({ solved: stats.solved + 1 });
    if (mode === 'sprint') {
      sprintRef.current += 1;
      setSprintSolved(sprintRef.current);
      window.setTimeout(() => load(makePuzzle(sprintRef.current >= 3 ? 'medium' : 'easy', Date.now())), 700);
      return;
    }
    const base = LEVELS[puzzle.level].xp;
    const xp = Math.round(base * Math.max(0.25, 1 - 0.25 * hints));
    if (mode === 'daily') {
      if (stats.dailyDone === todayKey()) return showToast('Already counted today. Come back tomorrow for XP.');
      save({ dailyDone: todayKey() });
      gainXp(xp * DAILY_MULT, 'iq', 'Logic Rows Daily');
    } else if (mode === 'strict') {
      gainXp(base * STRICT_MULT, 'iq', `Logic Rows Strict [${LEVELS[puzzle.level].label}]`);
    } else {
      gainXp(xp, 'iq', `Logic Rows ${mode === 'ladder' ? 'Ladder' : ''}[${LEVELS[puzzle.level].label}]`);
      if (mode === 'ladder' && rung === LADDER.length - 1) gainXp(LADDER_BONUS, 'iq', 'Logic Rows Ladder complete');
    }
  };

  const check = () => {
    const perm = Array(names.length).fill(0);
    placed.forEach((item, row) => {
      if (item !== null) perm[item] = row;
    });
    const bad = puzzle.clues.map((c, i) => (holds(c, perm) ? -1 : i)).filter((i) => i >= 0);
    if (bad.length === 0) finish();
    else {
      sounds.playClick();
      setWrong(bad);
      if (mode === 'strict') {
        if (checks <= 1) {
          showToast('Out of checks. Here is a new puzzle.');
          start('strict', level);
        } else setChecks(checks - 1);
      }
    }
  };

  const hint = () => {
    const row = placed.findIndex((p, r) => p !== puzzle.solution.indexOf(r));
    if (row === -1 || solved) return;
    const item = puzzle.solution.indexOf(row);
    const copy = placed.map((p) => (p === item ? null : p));
    copy[row] = item;
    setPlaced(copy);
    setHints((h) => h + 1);
    setWrong([]);
  };

  const dailyDone = stats.dailyDone === todayKey();
  const mm = String(Math.floor(left / 60)).padStart(1, '0') + ':' + String(left % 60).padStart(2, '0');

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-1">
        <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-50">Logic Rows</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Put each item in its own row using the clues. Rows are listed top to bottom. Tap a clue to cross it off.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
        {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
          <button key={m} aria-pressed={mode === m} onClick={() => start(m)} className={`${chip} ${mode === m ? on : idle}`}>
            {MODE_LABEL[m]}{m === 'daily' && dailyDone ? ' ✓' : ''}
          </button>
        ))}
      </div>

      {(mode === 'classic' || mode === 'strict') && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty">
          {(Object.keys(LEVELS) as Level[]).map((l) => (
            <button key={l} aria-pressed={level === l} onClick={() => start(mode, l)} className={`${chip} ${level === l ? on : idle}`}>
              {LEVELS[l].label} · {LEVELS[l].size} rows
            </button>
          ))}
        </div>
      )}
      {mode === 'ladder' && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Climb six rungs, 3 to 8 rows. Rung <b>{rung + 1}</b> of {LADDER.length}: {LEVELS[LADDER[rung]].label}. Finish the top for +{LADDER_BONUS.toLocaleString()} XP.
        </p>
      )}
      {mode === 'strict' && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No hints. <b>{checks}</b> check{checks === 1 ? '' : 's'} left, then the puzzle resets. Pays {STRICT_MULT}x XP.
        </p>
      )}
      {mode === 'daily' && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          One 6-row puzzle for everyone each day. First solve pays double XP ({(LEVELS.hard.xp * DAILY_MULT).toLocaleString()}).
          {dailyDone && ' Today’s XP is claimed; you can still replay it.'}
        </p>
      )}
      {mode === 'sprint' && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <Timer className="w-3.5 h-3.5" aria-hidden="true" />
          <b role="timer" aria-label="Time left">{mm}</b> · solved <b>{sprintSolved}</b> · best {stats.bestSprint} · {SPRINT_XP} XP each
        </p>
      )}

      {mode === 'sprint' && run === 'over' ? (
        <div role="status" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 text-center space-y-3">
          <Trophy className="w-8 h-8 mx-auto text-amber-500" aria-hidden="true" />
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Time’s up: {sprintSolved} solved</p>
          <p className="text-sm text-zinc-500">{sprintSolved > 0 ? `+${(sprintSolved * SPRINT_XP).toLocaleString()} XP` : 'Solve one next time to earn XP.'}</p>
          <button onClick={() => start('sprint')} className={`${chip} ${on}`}>Play again</button>
        </div>
      ) : (
        <>
          <ol className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-3.5 space-y-1.5 text-sm" aria-label="Clues">
            {clues.map((text, i) => (
              <li key={i}>
                <button
                  onClick={() => setStruck((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
                  className={`w-full text-left min-h-[32px] cursor-pointer ${struck.includes(i) ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-100'} ${wrong.includes(i) ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}`}
                >
                  {i + 1}. {text}
                  {wrong.includes(i) && ' ✗'}
                </button>
              </li>
            ))}
          </ol>

          <div className="space-y-2" aria-label="Rows">
            {placed.map((item, r) => (
              <button
                key={r}
                onClick={() => {
                  if (solved) return;
                  if (item !== null) setPlaced((p) => p.map((x, i) => (i === r ? null : x)));
                  setSel(r);
                  setWrong([]);
                }}
                aria-label={`${rowName(r)} row${item !== null ? `: ${names[item]}` : ', empty'}`}
                className="w-full min-h-[48px] px-4 rounded-xl border-2 flex items-center gap-3 text-left cursor-pointer bg-white dark:bg-zinc-900/90"
                style={{ borderColor: sel === r && !solved ? '#f59e0b' : solved ? '#10b981' : 'rgba(113,113,122,0.5)' }}
              >
                <span className="w-4 h-4 rounded-sm shrink-0 border border-white/40" style={{ background: ROW_COLORS[puzzle.rows[r]].hex }} aria-hidden="true" />
                <span className="font-bold tracking-wide text-zinc-900 dark:text-zinc-50">{item !== null ? names[item] : ''}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Items to place">
            {names.map((n, i) => (
              <button key={n} disabled={used.has(i) || solved} onClick={() => put(i)} className={`${chip} ${idle} disabled:opacity-30`}>
                {n}
              </button>
            ))}
          </div>

          {wrong.length > 0 && (
            <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
              Not yet. Clue{wrong.length > 1 ? 's' : ''} {wrong.map((i) => i + 1).join(', ')} {wrong.length > 1 ? 'are' : 'is'} not satisfied.
            </p>
          )}
          {solved && mode !== 'sprint' && (
            <p role="status" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Solved{hints ? ` with ${hints} hint${hints > 1 ? 's' : ''}` : ''}!
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {!solved && (
              <button onClick={check} disabled={!full} className={`${chip} ${on} disabled:opacity-40 disabled:cursor-not-allowed flex-1`}>
                Check
              </button>
            )}
            {!solved && mode !== 'sprint' && mode !== 'strict' && (
              <button onClick={hint} className={`${chip} ${idle} inline-flex items-center gap-1.5`}>
                <Lightbulb className="w-4 h-4" aria-hidden="true" /> Hint (−25% XP)
              </button>
            )}
            {(mode === 'classic' || mode === 'strict' || mode === 'ladder') && solved && (
              <button
                onClick={() => {
                  if (mode !== 'ladder') return start(mode);
                  const next = rung === LADDER.length - 1 ? 0 : rung + 1;
                  setRung(next);
                  load(makePuzzle(LADDER[next], Date.now()));
                }}
                className={`${chip} ${on} inline-flex items-center gap-1.5 flex-1`}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" /> {mode === 'ladder' ? (rung === LADDER.length - 1 ? 'Climb again' : 'Next rung') : 'Next puzzle'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
