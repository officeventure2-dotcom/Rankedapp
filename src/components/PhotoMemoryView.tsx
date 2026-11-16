import React, { useEffect, useMemo, useState } from 'react';
import {
  Anchor, Apple, ArrowLeft, Bell, Bike, Bird, Cake, Camera, Car, Cat, Cloud, Coffee, Crown, Dog, Fish,
  Flower2, Gem, Gift, Heart, Key, Leaf, Moon, Music, Plane, Rocket, Star, Sun, Trophy, Umbrella,
  type LucideIcon
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import {
  gradeGrid,
  makeChangeRound,
  makeRound,
  nextLevel,
  type ChangeRound,
  type Round
} from '../utils/photoMemory';

const PICTURES: Array<{ name: string; Icon: LucideIcon; color: string }> = [
  { name: 'apple', Icon: Apple, color: '#ef4444' },
  { name: 'anchor', Icon: Anchor, color: '#0ea5e9' },
  { name: 'bell', Icon: Bell, color: '#f59e0b' },
  { name: 'bicycle', Icon: Bike, color: '#10b981' },
  { name: 'bird', Icon: Bird, color: '#38bdf8' },
  { name: 'cake', Icon: Cake, color: '#ec4899' },
  { name: 'camera', Icon: Camera, color: '#64748b' },
  { name: 'car', Icon: Car, color: '#f97316' },
  { name: 'cat', Icon: Cat, color: '#a855f7' },
  { name: 'cloud', Icon: Cloud, color: '#60a5fa' },
  { name: 'coffee', Icon: Coffee, color: '#a16207' },
  { name: 'crown', Icon: Crown, color: '#eab308' },
  { name: 'dog', Icon: Dog, color: '#d97706' },
  { name: 'fish', Icon: Fish, color: '#14b8a6' },
  { name: 'flower', Icon: Flower2, color: '#f43f5e' },
  { name: 'gem', Icon: Gem, color: '#8b5cf6' },
  { name: 'gift', Icon: Gift, color: '#e11d48' },
  { name: 'heart', Icon: Heart, color: '#fb7185' },
  { name: 'key', Icon: Key, color: '#ca8a04' },
  { name: 'leaf', Icon: Leaf, color: '#22c55e' },
  { name: 'moon', Icon: Moon, color: '#6366f1' },
  { name: 'music note', Icon: Music, color: '#d946ef' },
  { name: 'plane', Icon: Plane, color: '#06b6d4' },
  { name: 'rocket', Icon: Rocket, color: '#f97316' },
  { name: 'star', Icon: Star, color: '#facc15' },
  { name: 'sun', Icon: Sun, color: '#fb923c' },
  { name: 'trophy', Icon: Trophy, color: '#f59e0b' },
  { name: 'umbrella', Icon: Umbrella, color: '#3b82f6' }
];

const KEY = 'ranked.photomem.v1';
interface Saved {
  gridLevel: number;
  gridBest: number;
  changeBest: number;
}
function load(): Saved {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Saved>;
      return { gridLevel: p.gridLevel || 1, gridBest: p.gridBest || 0, changeBest: p.changeBest || 0 };
    }
  } catch {
    /* ignore */
  }
  return { gridLevel: 1, gridBest: 0, changeBest: 0 };
}

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40';

const Tile: React.FC<{ item: number | null; ring?: string; dim?: boolean }> = ({ item, ring, dim }) => {
  if (item === null) return <span className="block w-full h-full rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600" style={ring ? { borderColor: ring, borderStyle: 'solid' } : undefined} />;
  const { Icon, color } = PICTURES[item];
  return (
    <span
      className="flex items-center justify-center w-full h-full rounded-xl"
      style={{ background: `${color}26`, border: `2px solid ${ring ?? `${color}55`}`, opacity: dim ? 0.3 : 1 }}
    >
      <Icon className="w-1/2 h-1/2" style={{ color }} aria-hidden="true" />
    </span>
  );
};

const gridStyle = (cols: number): React.CSSProperties => ({
  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  maxWidth: cols === 2 ? '11rem' : '15rem',
  marginInline: 'auto'
});

type Game = 'menu' | 'grid' | 'change';

export const PhotoMemoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [saved, setSaved] = useState<Saved>(load);
  const [game, setGame] = useState<Game>('menu');
  const save = (patch: Partial<Saved>) =>
    setSaved((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  if (game === 'grid') return <GridGame saved={saved} save={save} onExit={() => setGame('menu')} />;
  if (game === 'change') return <ChangeGame saved={saved} save={save} onExit={() => setGame('menu')} />;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <button onClick={onBack} className={`${softBtn} inline-flex items-center gap-2`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50">Photo Memory</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Train your visual memory. Look at a set of pictures, then bring it back from memory. It gets harder as you improve.
        </p>
      </div>
      {(
        [
          ['grid', 'Rebuild the picture', `Study the grid, then put every picture back in its place. Level ${saved.gridLevel}${saved.gridBest ? ` · best ${saved.gridBest}` : ''}.`],
          ['change', 'What changed?', `Memorize the grid, then spot the picture that was swapped.${saved.changeBest ? ` Best streak ${saved.changeBest}.` : ''}`]
        ] as const
      ).map(([id, title, text]) => (
        <button
          key={id}
          onClick={() => {
            haptics.tap();
            setGame(id);
          }}
          className={`${card} w-full p-4 text-left cursor-pointer hover:border-fuchsia-500/60 transition-colors`}
        >
          <span className="flex items-center gap-3">
            <span className="grid grid-cols-2 gap-1 w-14 h-14 shrink-0" aria-hidden="true">
              {(id === 'grid' ? [0, 8, 15, 24] : [3, 20, 17, 25]).map((i) => (
                <Tile key={i} item={i} />
              ))}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">{text}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

type GameProps = { saved: Saved; save: (p: Partial<Saved>) => void; onExit: () => void };

/** Counts down while the person studies, then calls onDone. */
function useCountdown(seconds: number, running: boolean, onDone: () => void) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => setLeft(seconds), [seconds]);
  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left, running]); // eslint-disable-line react-hooks/exhaustive-deps
  return left;
}

const Header: React.FC<{ title: string; sub: string; onExit: () => void }> = ({ title, sub, onExit }) => (
  <div className="flex items-center gap-2">
    <button onClick={onExit} aria-label="Back to Photo Memory" className={`${softBtn} px-3`}>
      <ArrowLeft className="w-4 h-4" />
    </button>
    <div className="min-w-0">
      <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-50 truncate">{title}</h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
    </div>
  </div>
);

// ---------- Rebuild the picture ----------

const GridGame: React.FC<GameProps> = ({ saved, save, onExit }) => {
  const [level, setLevel] = useState(saved.gridLevel);
  const [round, setRound] = useState<Round>(() => makeRound(saved.gridLevel, Date.now()));
  const [phase, setPhase] = useState<'study' | 'recall' | 'result'>('study');
  const [placed, setPlaced] = useState<Array<number | null>>([]);
  const [sel, setSel] = useState(0);

  const left = useCountdown(round.studySeconds, phase === 'study', () => begin());

  function begin() {
    setPlaced(round.cells.map(() => null));
    setSel(0);
    setPhase('recall');
  }
  const next = (lvl: number) => {
    setLevel(lvl);
    setRound(makeRound(lvl, Date.now()));
    setPhase('study');
  };

  const result = useMemo(() => (phase === 'result' ? gradeGrid(round, placed) : null), [phase, round, placed]);
  const used = new Set(placed.filter((p): p is number => p !== null));

  const put = (item: number) => {
    if (used.has(item)) return;
    const target = placed[sel] === null ? sel : placed.findIndex((p) => p === null);
    if (target === -1) return;
    haptics.tap();
    const copy = placed.slice();
    copy[target] = item;
    setPlaced(copy);
    const nextEmpty = copy.findIndex((p) => p === null);
    setSel(nextEmpty === -1 ? target : nextEmpty);
  };

  const check = () => {
    haptics.tap();
    const g = gradeGrid(round, placed);
    const lvl = nextLevel(level, g.correct, g.total);
    save({ gridLevel: lvl, gridBest: Math.max(saved.gridBest, g.correct === g.total ? level : 0) });
    setPhase('result');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <Header title="Rebuild the picture" sub={`Level ${level} · ${round.cells.length} pictures`} onExit={onExit} />

      {phase === 'study' && (
        <div className={`${card} p-4 space-y-3`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Remember each picture and where it is. <b>{left}s</b> left.
          </p>
          <div className="grid gap-2" style={gridStyle(round.cols)} aria-label="Pictures to remember">
            {round.cells.map((item, i) => (
              <div key={i} className="aspect-square" role="img" aria-label={PICTURES[item].name}>
                <Tile item={item} />
              </div>
            ))}
          </div>
          <button onClick={begin} className={`${primaryBtn} w-full`}>
            I’m ready
          </button>
        </div>
      )}

      {(phase === 'recall' || phase === 'result') && (
        <div className={`${card} p-4 space-y-4`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {phase === 'recall'
              ? 'Tap a square, then tap the picture that belongs there.'
              : result && result.correct === result.total
                ? `Perfect! All ${result.total} in the right place.`
                : `${result?.correct} of ${result?.total} in the right place.`}
          </p>
          <div className="grid gap-2" style={gridStyle(round.cols)} aria-label="Your grid">
            {round.cells.map((answer, i) => {
              const right = phase === 'result' && placed[i] === answer;
              const wrong = phase === 'result' && !right;
              const ring = phase === 'recall' ? (sel === i ? '#f59e0b' : undefined) : right ? '#10b981' : '#f43f5e';
              return (
                <button
                  key={i}
                  disabled={phase === 'result'}
                  onClick={() => {
                    if (placed[i] !== null) {
                      const c = placed.slice();
                      c[i] = null;
                      setPlaced(c);
                    }
                    setSel(i);
                  }}
                  aria-label={`Square ${i + 1}${placed[i] !== null ? `: ${PICTURES[placed[i] as number].name}` : ': empty'}${wrong ? ', wrong' : right ? ', correct' : ''}`}
                  className="aspect-square cursor-pointer"
                >
                  <Tile item={placed[i] ?? null} ring={ring} />
                </button>
              );
            })}
          </div>

          {phase === 'recall' && (
            <>
              <div className="grid grid-cols-5 gap-2" aria-label="Pictures to choose from">
                {round.tray.map((item) => (
                  <button
                    key={item}
                    onClick={() => put(item)}
                    disabled={used.has(item)}
                    aria-label={PICTURES[item].name}
                    className="aspect-square cursor-pointer"
                  >
                    <Tile item={item} dim={used.has(item)} />
                  </button>
                ))}
              </div>
              <button onClick={check} disabled={placed.some((p) => p === null)} className={`${primaryBtn} w-full`}>
                Check
              </button>
            </>
          )}

          {phase === 'result' && result && (
            <>
              {result.correct !== result.total && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-zinc-500">The original</p>
                  <div className="grid gap-2" style={gridStyle(round.cols)} aria-label="The original grid">
                    {round.cells.map((item, i) => (
                      <div key={i} className="aspect-square">
                        <Tile item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Next level: {nextLevel(level, result.correct, result.total)}
              </p>
              <div className="flex gap-2">
                <button onClick={onExit} className={softBtn}>
                  Done
                </button>
                <button onClick={() => next(nextLevel(level, result.correct, result.total))} className={`${primaryBtn} flex-1`}>
                  Next round
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ---------- What changed? ----------

const ChangeGame: React.FC<GameProps> = ({ saved, save, onExit }) => {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<ChangeRound>(() => makeChangeRound(1, Date.now()));
  const [phase, setPhase] = useState<'study' | 'pick' | 'result'>('study');
  const [picked, setPicked] = useState<number | null>(null);

  const left = useCountdown(round.studySeconds, phase === 'study', () => setPhase('pick'));

  const choose = (i: number) => {
    haptics.tap();
    setPicked(i);
    setPhase('result');
    if (i === round.changedCell) {
      const s = streak + 1;
      setStreak(s);
      setLevel(Math.min(9, 1 + Math.floor(s / 2)));
      if (s > saved.changeBest) save({ changeBest: s });
    } else {
      setStreak(0);
      setLevel(1);
    }
  };

  const nextRound = () => {
    setRound(makeChangeRound(level, Date.now()));
    setPicked(null);
    setPhase('study');
  };

  const ok = picked === round.changedCell;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <Header title="What changed?" sub={`Streak ${streak} · best ${saved.changeBest}`} onExit={onExit} />
      <div className={`${card} p-4 space-y-3`}>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {phase === 'study' && (
            <>
              Memorize the grid. <b>{left}s</b> left.
            </>
          )}
          {phase === 'pick' && 'One picture was swapped for a new one. Tap it.'}
          {phase === 'result' && (ok ? 'Correct! You spotted it.' : 'Not that one. The swapped picture is outlined.')}
        </p>
        <div className="grid gap-2" style={gridStyle(round.cols)} aria-label={phase === 'study' ? 'Pictures to remember' : 'Changed grid'}>
          {(phase === 'study' ? round.before : round.after).map((item, i) => (
            <button
              key={`${phase}-${i}`}
              disabled={phase !== 'pick'}
              onClick={() => choose(i)}
              aria-label={phase === 'pick' ? `Square ${i + 1}` : PICTURES[item].name}
              className="aspect-square cursor-pointer"
            >
              <Tile
                item={item}
                ring={phase === 'result' ? (i === round.changedCell ? '#10b981' : i === picked ? '#f43f5e' : undefined) : undefined}
              />
            </button>
          ))}
        </div>
        {phase === 'study' && (
          <button onClick={() => setPhase('pick')} className={`${primaryBtn} w-full`}>
            I’m ready
          </button>
        )}
        {phase === 'result' && (
          <div className="flex gap-2">
            <button onClick={onExit} className={softBtn}>
              Done
            </button>
            <button onClick={nextRound} className={`${primaryBtn} flex-1`}>
              Next round
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
