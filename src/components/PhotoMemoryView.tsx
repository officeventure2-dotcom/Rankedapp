import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Anchor, Apple, ArrowLeft, Bell, Bike, Bird, Cake, Camera, Car, Cat, Cloud, Coffee, Crown, Dog, Fish,
  Flower2, Gem, Gift, Heart, ImagePlus, Key, Leaf, Loader2, Moon, Music, Plane, Rocket, Star, Sun, Trophy, Umbrella, X,
  type LucideIcon
} from 'lucide-react';
import { haptics } from '../utils/haptics';
import {
  gradeGrid,
  makeChangeRound,
  makeRound,
  maxLevel,
  nextLevel,
  type ChangeRound,
  type Round
} from '../utils/photoMemory';
import {
  FULL_OWN_PHOTOS,
  MAX_OWN_PHOTOS,
  MIN_OWN_PHOTOS,
  WEB_PHOTO_URLS,
  fileToThumb,
  loadOwnPhotos,
  preloadImages,
  saveOwnPhotos,
  type OwnPhoto
} from '../utils/photoLibrary';

/** One thing to remember: a built-in icon, or a photograph (src). */
interface Pic {
  name: string;
  Icon?: LucideIcon;
  color?: string;
  src?: string;
}
type Source = 'icons' | 'web' | 'mine';

const PICTURES: Pic[] = [
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
  source: Source;
}
function load(): Saved {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Saved>;
      return {
        gridLevel: p.gridLevel || 1,
        gridBest: p.gridBest || 0,
        changeBest: p.changeBest || 0,
        source: p.source === 'web' || p.source === 'mine' ? p.source : 'icons'
      };
    }
  } catch {
    /* ignore */
  }
  return { gridLevel: 1, gridBest: 0, changeBest: 0, source: 'icons' };
}

const card =
  'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm';
const primaryBtn =
  'min-h-touch px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const softBtn =
  'min-h-touch px-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-40';

const Tile: React.FC<{ pool: Pic[]; item: number | null; ring?: string; dim?: boolean }> = ({ pool, item, ring, dim }) => {
  if (item === null)
    return (
      <span
        className="block w-full h-full rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600"
        style={ring ? { borderColor: ring, borderStyle: 'solid' } : undefined}
      />
    );
  const pic = pool[item];
  if (pic.src) {
    return (
      <span
        className="block w-full h-full rounded-xl overflow-hidden"
        style={{ border: `2px solid ${ring ?? 'rgba(148,163,184,0.5)'}`, opacity: dim ? 0.3 : 1 }}
      >
        <img src={pic.src} alt="" draggable={false} className="w-full h-full object-cover select-none" />
      </span>
    );
  }
  const { Icon, color = '#64748b' } = pic;
  return (
    <span
      className="flex items-center justify-center w-full h-full rounded-xl"
      style={{ background: `${color}26`, border: `2px solid ${ring ?? `${color}55`}`, opacity: dim ? 0.3 : 1 }}
    >
      {Icon && <Icon className="w-1/2 h-1/2" style={{ color }} aria-hidden="true" />}
    </span>
  );
};

const gridStyle = (cols: number): React.CSSProperties => ({
  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  maxWidth: cols === 2 ? '11rem' : '15rem',
  marginInline: 'auto'
});

type Game = 'menu' | 'grid' | 'change';

const SOURCES: Array<{ id: Source; label: string }> = [
  { id: 'icons', label: 'Icons' },
  { id: 'web', label: 'Real photos' },
  { id: 'mine', label: 'My photos' }
];

export const PhotoMemoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [saved, setSaved] = useState<Saved>(load);
  const [game, setGame] = useState<Game>('menu');
  const [own, setOwn] = useState<OwnPhoto[]>(loadOwnPhotos);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const pool: Pic[] = useMemo(() => {
    if (saved.source === 'web') return WEB_PHOTO_URLS.map((src, i) => ({ name: `photo ${i + 1}`, src }));
    if (saved.source === 'mine') return own.map((o, i) => ({ name: `your photo ${i + 1}`, src: o.src }));
    return PICTURES;
  }, [saved.source, own]);

  const needMore = saved.source === 'mine' && own.length < MIN_OWN_PHOTOS;

  const addPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setNotice('');
    setBusy(true);
    let list = own;
    let skipped = 0;
    for (const file of Array.from(files)) {
      if (list.length >= MAX_OWN_PHOTOS) {
        setNotice(`You can keep up to ${MAX_OWN_PHOTOS} photos.`);
        break;
      }
      try {
        const src = await fileToThumb(file);
        const next = [...list, { id: `p_${Date.now()}_${list.length}`, src }];
        if (!saveOwnPhotos(next)) {
          setNotice('This device has no room left to keep more photos. Remove some first.');
          break;
        }
        list = next;
      } catch {
        skipped++;
      }
    }
    if (skipped) setNotice(`${skipped} file${skipped === 1 ? '' : 's'} could not be read as a picture.`);
    setOwn(list);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    const next = own.filter((o) => o.id !== id);
    setOwn(next);
    saveOwnPhotos(next);
  };

  const levelHere = Math.min(saved.gridLevel, maxLevel(pool.length));

  if (game === 'grid') return <GridGame saved={{ ...saved, gridLevel: levelHere }} save={save} pool={pool} onExit={() => setGame('menu')} />;
  if (game === 'change') return <ChangeGame saved={saved} save={save} pool={pool} onExit={() => setGame('menu')} />;

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

      <div className={`${card} p-3.5 space-y-3`}>
        <div className="p-1 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-white/10 flex gap-1" role="radiogroup" aria-label="Pictures to use">
          {SOURCES.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={saved.source === o.id}
              onClick={() => {
                haptics.tap();
                save({ source: o.id });
              }}
              className={`flex-1 min-h-touch rounded-xl text-sm font-semibold cursor-pointer ${
                saved.source === o.id ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {saved.source === 'web' && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real photographs from Lorem Picsum, loaded when a round starts. Needs an internet connection.
          </p>
        )}
        {saved.source === 'icons' && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Simple coloured pictures. Works offline.</p>
        )}
      </div>

      <div className={`${card} p-3.5 space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">My photos ({own.length})</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Add {MIN_OWN_PHOTOS}+ of your own pictures ({FULL_OWN_PHOTOS}+ unlocks every level). They are shrunk and kept on this
              device only. Nothing is uploaded.
            </p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Choose photos"
          onChange={(e) => void addPhotos(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy || own.length >= MAX_OWN_PHOTOS}
          className={`${softBtn} w-full inline-flex items-center justify-center gap-2`}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="w-4 h-4" aria-hidden="true" />}
          {busy ? 'Adding…' : 'Add photos'}
        </button>
        {notice && (
          <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">
            {notice}
          </p>
        )}
        {own.length > 0 && (
          <ul className="grid grid-cols-5 gap-2" aria-label="Your photos">
            {own.map((o, i) => (
              <li key={o.id} className="relative aspect-square">
                <img src={o.src} alt={`Your photo ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => removePhoto(o.id)}
                  aria-label={`Remove your photo ${i + 1}`}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {needMore && (
        <p role="status" className="text-sm rounded-xl px-3 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          Add {MIN_OWN_PHOTOS - own.length} more photo{MIN_OWN_PHOTOS - own.length === 1 ? '' : 's'} to play with your own pictures.
        </p>
      )}

      {(
        [
          ['grid', 'Rebuild the picture', `Study the grid, then put every picture back in its place. Level ${levelHere}${saved.gridBest ? ` · best ${saved.gridBest}` : ''}.`],
          ['change', 'What changed?', `Memorize the grid, then spot the picture that was swapped.${saved.changeBest ? ` Best streak ${saved.changeBest}.` : ''}`]
        ] as const
      ).map(([id, title, text]) => (
        <button
          key={id}
          disabled={needMore}
          onClick={() => {
            haptics.tap();
            setGame(id);
          }}
          className={`${card} w-full p-4 text-left cursor-pointer hover:border-fuchsia-500/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center gap-3">
            <span className="grid grid-cols-2 gap-1 w-14 h-14 shrink-0" aria-hidden="true">
              {(id === 'grid' ? [0, 1, 2, 3] : [3, 2, 1, 0]).map((i) => (
                <Tile key={i} pool={pool.length > 3 ? pool : PICTURES} item={i} />
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

type GameProps = { saved: Saved; save: (p: Partial<Saved>) => void; pool: Pic[]; onExit: () => void };

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

/** Make sure a round's photographs are on screen-ready before the study timer starts. */
function useReady(pool: Pic[], items: number[], roundKey: unknown, attempt: number): 'loading' | 'ready' | 'failed' {
  const urls = items.map((i) => pool[i]?.src).filter((u): u is string => !!u);
  // The result belongs to one specific round + attempt, so a new round never inherits "ready".
  const stamp = `${attempt}`;
  const [done, setDone] = useState<{ key: unknown; stamp: string; ok: boolean } | null>(null);
  useEffect(() => {
    if (urls.length === 0) return;
    let live = true;
    preloadImages(urls).then((ok) => live && setDone({ key: roundKey, stamp, ok }));
    return () => {
      live = false;
    };
  }, [roundKey, attempt]); // eslint-disable-line react-hooks/exhaustive-deps
  if (urls.length === 0) return 'ready';
  if (!done || done.key !== roundKey || done.stamp !== stamp) return 'loading';
  return done.ok ? 'ready' : 'failed';
}

const Loading: React.FC<{ status: 'loading' | 'failed'; retry: () => void; onExit: () => void }> = ({ status, retry, onExit }) =>
  status === 'loading' ? (
    <p className="text-sm text-zinc-500 flex items-center gap-2" role="status">
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading photos…
    </p>
  ) : (
    <div role="alert" className="space-y-2 text-sm text-rose-600 dark:text-rose-400">
      <p>Could not load the photos. Check your connection, or switch to Icons.</p>
      <div className="flex gap-2">
        <button onClick={onExit} className={softBtn}>
          Back
        </button>
        <button onClick={retry} className={primaryBtn}>
          Try again
        </button>
      </div>
    </div>
  );

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

const GridGame: React.FC<GameProps> = ({ saved, save, pool, onExit }) => {
  const [level, setLevel] = useState(saved.gridLevel);
  const [round, setRound] = useState<Round>(() => makeRound(saved.gridLevel, Date.now(), pool.length));
  const [phase, setPhase] = useState<'study' | 'recall' | 'result'>('study');
  const [placed, setPlaced] = useState<Array<number | null>>([]);
  const [sel, setSel] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const status = useReady(pool, round.tray, round, attempt);
  const left = useCountdown(round.studySeconds, phase === 'study' && status === 'ready', () => begin());

  function begin() {
    setPlaced(round.cells.map(() => null));
    setSel(0);
    setPhase('recall');
  }
  const next = (lvl: number) => {
    setLevel(lvl);
    setRound(makeRound(lvl, Date.now(), pool.length));
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
    save({ gridLevel: nextLevel(level, g.correct, g.total, pool.length), gridBest: Math.max(saved.gridBest, g.correct === g.total ? level : 0) });
    setPhase('result');
  };

  const after = result ? nextLevel(level, result.correct, result.total, pool.length) : level;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <Header title="Rebuild the picture" sub={`Level ${level} · ${round.cells.length} pictures`} onExit={onExit} />

      {phase === 'study' && (
        <div className={`${card} p-4 space-y-3`}>
          {status !== 'ready' ? (
            <Loading status={status} retry={() => setAttempt((n) => n + 1)} onExit={onExit} />
          ) : (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Remember each picture and where it is. <b>{left}s</b> left.
              </p>
              <div className="grid gap-2" style={gridStyle(round.cols)} aria-label="Pictures to remember">
                {round.cells.map((item, i) => (
                  <div key={i} className="aspect-square" role="img" aria-label={pool[item].name}>
                    <Tile pool={pool} item={item} />
                  </div>
                ))}
              </div>
              <button onClick={begin} className={`${primaryBtn} w-full`}>
                I’m ready
              </button>
            </>
          )}
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
                  aria-label={`Square ${i + 1}${placed[i] !== null ? `: ${pool[placed[i] as number].name}` : ': empty'}${wrong ? ', wrong' : right ? ', correct' : ''}`}
                  className="aspect-square cursor-pointer"
                >
                  <Tile pool={pool} item={placed[i] ?? null} ring={ring} />
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
                    aria-label={pool[item].name}
                    className="aspect-square cursor-pointer"
                  >
                    <Tile pool={pool} item={item} dim={used.has(item)} />
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
                  <div className="grid gap-2" style={{ ...gridStyle(round.cols), maxWidth: '9rem' }} aria-label="The original grid">
                    {round.cells.map((item, i) => (
                      <div key={i} className="aspect-square">
                        <Tile pool={pool} item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Next level: {after}</p>
              <div className="flex gap-2">
                <button onClick={onExit} className={softBtn}>
                  Done
                </button>
                <button onClick={() => next(after)} className={`${primaryBtn} flex-1`}>
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

const ChangeGame: React.FC<GameProps> = ({ saved, save, pool, onExit }) => {
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<ChangeRound>(() => makeChangeRound(1, Date.now(), pool.length));
  const [phase, setPhase] = useState<'study' | 'pick' | 'result'>('study');
  const [picked, setPicked] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  const status = useReady(pool, [...round.before, round.after[round.changedCell]], round, attempt);
  const left = useCountdown(round.studySeconds, phase === 'study' && status === 'ready', () => setPhase('pick'));

  const choose = (i: number) => {
    haptics.tap();
    setPicked(i);
    setPhase('result');
    if (i === round.changedCell) {
      const s = streak + 1;
      setStreak(s);
      setLevel(Math.min(maxLevel(pool.length), 1 + Math.floor(s / 2)));
      if (s > saved.changeBest) save({ changeBest: s });
    } else {
      setStreak(0);
      setLevel(1);
    }
  };

  const nextRound = () => {
    setRound(makeChangeRound(level, Date.now(), pool.length));
    setPicked(null);
    setPhase('study');
  };

  const ok = picked === round.changedCell;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <Header title="What changed?" sub={`Streak ${streak} · best ${saved.changeBest}`} onExit={onExit} />
      <div className={`${card} p-4 space-y-3`}>
        {phase === 'study' && status !== 'ready' ? (
          <Loading status={status} retry={() => setAttempt((n) => n + 1)} onExit={onExit} />
        ) : (
          <>
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
                  aria-label={phase === 'pick' ? `Square ${i + 1}` : pool[item].name}
                  className="aspect-square cursor-pointer"
                >
                  <Tile
                    pool={pool}
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
          </>
        )}
      </div>
    </div>
  );
};
