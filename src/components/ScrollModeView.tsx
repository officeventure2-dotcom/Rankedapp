import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp, Heart, Share2 } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { FACT_TOPICS, FEED_FACTS, type FeedFact } from '../data/factsFeed';
import { factArt, type FactTopic } from '../utils/artwork';
import { haptics } from '../utils/haptics';

type TopicFilter = FactTopic | 'all';

const STORE_KEY = 'ranked.scroll.v1';

function readStore(): { liked: string[]; saved: string[] } {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { liked: parsed.liked ?? [], saved: parsed.saved ?? [] };
    }
  } catch {
    /* storage can be unavailable; the feed still works */
  }
  return { liked: [], saved: [] };
}

function shuffled(list: FeedFact[]): FeedFact[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Endless, snap-scrolling feed of facts with a picture on every card. */
export const ScrollModeView: React.FC = () => {
  const [topic, setTopic] = useState<TopicFilter>('all');

  return (
    <div className="max-w-md mx-auto space-y-3 animate-in fade-in duration-300">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1"
        role="tablist"
        aria-label="Fact topics"
      >
        {[{ id: 'all' as const, label: 'All topics' }, ...FACT_TOPICS].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={topic === t.id}
            onClick={() => {
              haptics.tap();
              setTopic(t.id);
            }}
            className={`shrink-0 min-h-touch px-3.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              topic === t.id
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 bg-white/60 dark:bg-zinc-900/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Keyed by topic so changing topic starts a fresh feed from the top. */}
      <Feed key={topic} topic={topic} />
    </div>
  );
};

const Feed: React.FC<{ topic: TopicFilter }> = ({ topic }) => {
  const { showToast } = useRanked();
  const [store, setStore] = useState(readStore);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const scroller = useRef<HTMLDivElement>(null);

  const pool = useMemo(
    () => (topic === 'all' ? FEED_FACTS : FEED_FACTS.filter((fact) => fact.topic === topic)),
    [topic]
  );

  // Each "page" of the feed is one shuffled pass through the pool; more pages are added as you near the end.
  const [pages, setPages] = useState<FeedFact[][]>(() => [shuffled(pool)]);

  const items = useMemo(
    () => pages.flatMap((page, p) => page.map((fact) => ({ fact, key: `${p}-${fact.id}` }))),
    [pages]
  );

  useEffect(() => {
    if (items.length > 0 && active >= items.length - 3) {
      setPages((prev) => [...prev, shuffled(pool)]);
    }
  }, [active, items.length, pool]);

  const persist = (next: { liked: string[]; saved: string[] }) => {
    setStore(next);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (kind: 'liked' | 'saved', id: string) => {
    haptics.tap();
    const has = store[kind].includes(id);
    persist({ ...store, [kind]: has ? store[kind].filter((x) => x !== id) : [...store[kind], id] });
    if (kind === 'saved') showToast(has ? 'Removed from saved facts' : 'Saved to your facts');
  };

  const share = async (fact: FeedFact) => {
    const text = `${fact.title}: ${fact.body}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: fact.title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      showToast('Fact copied to clipboard');
    } catch {
      /* share sheet dismissed */
    }
  };

  // Track which card is on screen.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setActive(Number(el.dataset.index));
            const id = el.dataset.fact;
            if (id) setSeen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
          }
        }
      },
      { root, threshold: 0.6 }
    );
    root.querySelectorAll('[data-index]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const go = useCallback((dir: 1 | -1) => {
    const root = scroller.current;
    if (!root) return;
    root.scrollBy({ top: dir * root.clientHeight, behavior: 'smooth' });
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          ref={scroller}
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Scrolling feed of facts"
          className="h-[calc(100dvh-17rem)] min-h-[420px] overflow-y-auto snap-y snap-mandatory scroll-smooth [overflow-anchor:none] rounded-3xl scrollbar-none overscroll-contain focus:outline-none"
        >
          {items.map(({ fact, key }, index) => {
            const liked = store.liked.includes(fact.id);
            const saved = store.saved.includes(fact.id);
            return (
              <article
                key={key}
                data-index={index}
                data-fact={fact.id}
                className="snap-start snap-always h-full pb-3"
              >
                <div className="h-full flex flex-col rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm">
                  <div className="relative basis-[46%] min-h-0 shrink-0">
                    <img
                      src={factArt(fact.topic, fact.id)}
                      alt={`Illustration for ${fact.title}`}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="fact-tag absolute left-3 top-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur text-[10px] font-mono font-semibold uppercase tracking-wider text-white">
                      {fact.field}
                    </span>
                  </div>
                  <div className="flex-1 min-h-0 p-4 flex flex-col">
                    <h3 className="text-lg font-bold font-['Outfit'] leading-snug text-zinc-900 dark:text-zinc-50">
                      {fact.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 overflow-y-auto">
                      {fact.body}
                    </p>
                    <div className="mt-auto pt-3 flex items-center gap-1">
                      <button
                        onClick={() => toggle('liked', fact.id)}
                        aria-pressed={liked}
                        aria-label={liked ? 'Unlike this fact' : 'Like this fact'}
                        className="min-h-touch min-w-touch flex items-center justify-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Heart
                          className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-zinc-500 dark:text-zinc-400'}`}
                        />
                      </button>
                      <button
                        onClick={() => toggle('saved', fact.id)}
                        aria-pressed={saved}
                        aria-label={saved ? 'Remove from saved' : 'Save this fact'}
                        className="min-h-touch min-w-touch flex items-center justify-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${saved ? 'fill-amber-500 text-amber-500' : 'text-zinc-500 dark:text-zinc-400'}`}
                        />
                      </button>
                      <button
                        onClick={() => share(fact)}
                        aria-label="Share this fact"
                        className="min-h-touch min-w-touch flex items-center justify-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Share2 className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      </button>
                      <span className="ml-auto text-[10px] font-mono text-zinc-400">
                        Swipe up for more
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden sm:flex flex-col gap-2 absolute -right-14 top-1/2 -translate-y-1/2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous fact"
            className="min-h-touch min-w-touch rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 flex items-center justify-center cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next fact"
            className="min-h-touch min-w-touch rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 flex items-center justify-center cursor-pointer"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-zinc-400">
        {seen.size} viewed · {store.saved.length} saved · {store.liked.length} liked
      </p>
    </div>
  );
};
