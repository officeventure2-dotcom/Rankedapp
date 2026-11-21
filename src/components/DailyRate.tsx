import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Mic, Plus, Square, X } from 'lucide-react';
import { useAuth } from '../auth/AuthGate';

interface Circle { id: string; name: string; you: boolean; rate: number | null; count: number }
interface Moment { id: string; created: number; text: string; photo: string; audio: string; rate: number | null; summary: string }
interface Detail { name: string; you: boolean; rate: number | null; sections: Record<string, number> | null; moments: Moment[] }

const SECTION_LABEL: Record<string, string> = { mood: 'Mood', energy: 'Energy', focus: 'Focus', connection: 'Connection', growth: 'Growth' };
const tone = (r: number | null) => (r === null ? '#71717a' : r >= 70 ? '#10b981' : r >= 40 ? '#f59e0b' : '#f43f5e');
const input = 'w-full min-h-touch px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-base';
const btn = 'min-h-touch px-4 rounded-xl border text-sm font-semibold cursor-pointer disabled:opacity-50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 inline-flex items-center justify-center gap-1.5';
const MAX_VOICE_SECONDS = 20;

async function api<T>(path: string, body?: unknown): Promise<{ ok: boolean; data: T & { error?: string } }> {
  const res = await fetch(path, body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: res.ok, data: await res.json() };
}

/** Shrink a photo to a small JPEG data URL so it fits in the database and loads fast. */
async function shrink(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  for (const q of [0.7, 0.5, 0.35]) {
    const url = c.toDataURL('image/jpeg', q);
    if (url.length <= 150_000) return url;
  }
  throw new Error('big');
}

const Ring: React.FC<{ rate: number | null; size?: number; children?: React.ReactNode }> = ({ rate, size = 64, children }) => (
  <span className="rounded-full p-[3px] shrink-0 flex" style={{ width: size, height: size, background: `conic-gradient(${tone(rate)} ${rate ?? 0}%, rgba(113,113,122,0.35) 0)` }}>
    <span className="w-full h-full rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 text-sm font-bold text-zinc-900 dark:text-zinc-50">{children ?? (rate === null ? '–' : rate)}</span>
  </span>
);

const Composer: React.FC<{ onDone: () => void; onCancel: () => void }> = ({ onDone, onCancel }) => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState('');
  const [audio, setAudio] = useState('');
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [secs, setSecs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const timer = useRef<number | undefined>(undefined);

  const pickPhoto = async (f?: File) => {
    if (!f) return;
    setErr('');
    try { setPhoto(await shrink(f)); } catch { setErr("That photo couldn't be used. Try another."); }
  };
  const stop = () => { window.clearInterval(timer.current); rec?.state === 'recording' && rec.stop(); setRec(null); };
  const record = async () => {
    setErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const fr = new FileReader();
        fr.onload = () => { const u = String(fr.result); u.length > 400_000 ? setErr('That voice note is too long.') : setAudio(u); };
        fr.readAsDataURL(new Blob(chunks, { type: r.mimeType }));
      };
      r.start(); setRec(r); setSecs(0);
      timer.current = window.setInterval(() => setSecs((s) => { if (s + 1 >= MAX_VOICE_SECONDS) r.stop(); return s + 1; }), 1000);
      r.addEventListener('stop', () => { window.clearInterval(timer.current); setRec(null); });
    } catch { setErr('Microphone access was blocked.'); }
  };
  const post = async () => {
    setBusy(true); setErr('');
    const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
    try {
      const r = await api<{ analysed: boolean }>('/api/daily/post', { text, photo, audio, expires: midnight.getTime() });
      if (!r.ok) setErr(r.data.error ?? 'Something went wrong.'); else onDone();
    } catch { setErr("Can't reach the server."); } finally { setBusy(false); }
  };

  return (
    <div className="mt-3 space-y-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3" aria-label="Add to your daily rate">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Share what you are doing right now. AI rates your day from it, and friends can see it until midnight.</p>
      <textarea className={input} rows={3} maxLength={600} placeholder="A quote, a thought, a poem…" aria-label="Your words" value={text} onChange={(e) => setText(e.target.value)} />
      {photo && <img src={photo} alt="Your photo" className="max-h-48 rounded-xl" />}
      {audio && <audio controls src={audio} className="w-full" />}
      <div className="flex flex-wrap gap-2">
        <label className={`${btn} cursor-pointer`}><Camera className="w-4 h-4" /> Photo
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void pickPhoto(e.target.files?.[0])} />
        </label>
        {rec
          ? <button className={btn} onClick={stop}><Square className="w-4 h-4 text-rose-500" /> Stop {secs}s</button>
          : <button className={btn} onClick={() => void record()}><Mic className="w-4 h-4" /> {audio ? 'Re-record' : 'Voice'}</button>}
        <button className={`${btn} ml-auto`} onClick={onCancel}>Cancel</button>
        <button className={`${btn} mem-on bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent`} disabled={busy || rec !== null || (!text.trim() && !photo && !audio)} onClick={() => void post()}>
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</> : 'Share'}
        </button>
      </div>
      {err && <p role="alert" className="text-xs text-rose-500">{err}</p>}
    </div>
  );
};

/** Stories-style strip at the top of Messages: everyone's daily rate in a ring, tap for the AI analysis. */
export const DailyRate: React.FC = () => {
  const { isGuest } = useAuth();
  const [circles, setCircles] = useState<Circle[] | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await api<{ circles: Circle[] }>('/api/daily/feed');
      if (r.ok) { setCircles(r.data.circles); setErr(''); } else setErr(r.data.error ?? '');
    } catch { setErr("Can't reach the server."); }
  }, []);
  useEffect(() => { if (!isGuest) void load(); }, [isGuest, load]);

  const open = async (id: string) => {
    try {
      const r = await api<Detail>(`/api/daily/user?id=${id}`);
      if (r.ok) setDetail(r.data); else setErr(r.data.error ?? '');
    } catch { setErr("Can't reach the server."); }
  };

  if (isGuest) return null;
  return (
    <section className="mb-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4" aria-label="Daily rate">
      <h3 className="text-sm font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100 mb-3">Daily rate</h3>
      {circles === null && !err && <Loader2 className="w-5 h-5 animate-spin text-zinc-400" aria-label="Loading" />}
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {circles?.map((c) => (
          <div key={c.id} className="flex flex-col items-center gap-1 shrink-0 w-16 relative">
            <button onClick={() => void open(c.id)} aria-label={`${c.you ? 'Your' : c.name + "'s"} daily rate: ${c.rate ?? 'not rated yet'}`} className="cursor-pointer"><Ring rate={c.rate} /></button>
            {c.you && <button onClick={() => setAdding(true)} aria-label="Add to your daily rate" className="absolute top-11 right-0 w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center cursor-pointer"><Plus className="w-4 h-4" /></button>}
            <span className="text-[11px] text-zinc-600 dark:text-zinc-300 truncate w-full text-center">{c.you ? 'You' : c.name}</span>
          </div>
        ))}
      </div>
      {circles && circles.length === 1 && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Friends who share a room with you show up here when they post.</p>}
      {err && <p role="alert" className="text-xs text-rose-500 mt-2">{err}</p>}
      {adding && <Composer onCancel={() => setAdding(false)} onDone={() => { setAdding(false); void load(); }} />}
      {detail && (
        <div className="mt-3 space-y-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3" aria-label="Daily rate analysis">
          <div className="flex items-center gap-3">
            <Ring rate={detail.rate} size={72} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{detail.you ? 'Your day' : `${detail.name}'s day`}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{detail.rate === null ? (detail.moments.length ? 'Not rated yet. The AI could not read these moments.' : 'Nothing shared yet today.') : 'Rated by AI from today\'s moments'}</p>
            </div>
            <button onClick={() => setDetail(null)} aria-label="Close" className="min-h-touch min-w-touch flex items-center justify-center cursor-pointer text-zinc-500"><X className="w-4 h-4" /></button>
          </div>
          {detail.sections && (
            <ul className="space-y-1.5" aria-label="Sections">
              {Object.entries(detail.sections).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-200">
                  <span className="w-20 shrink-0">{SECTION_LABEL[k] ?? k}</span>
                  <span className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${v}%`, background: tone(v) }} /></span>
                  <span className="w-7 text-right font-mono">{v}</span>
                </li>
              ))}
            </ul>
          )}
          <ul className="space-y-3">
            {detail.moments.map((m) => (
              <li key={m.id} className="space-y-1.5">
                <p className="text-[11px] font-mono text-zinc-500">{new Date(m.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{m.rate !== null && ` · ${m.rate}`}</p>
                {m.photo && <img src={m.photo} alt="" className="max-h-56 rounded-xl" />}
                {m.text && <p className="text-sm whitespace-pre-wrap break-words text-zinc-800 dark:text-zinc-100">{m.text}</p>}
                {m.audio && <audio controls src={m.audio} className="w-full" />}
                {m.summary && <p className="text-xs italic text-zinc-500 dark:text-zinc-400">{m.summary}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
