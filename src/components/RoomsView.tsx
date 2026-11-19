import React, { useCallback, useEffect, useState } from 'react';
import { Bell, BellOff, Check, Copy, Flame, Loader2, LogOut, Plus, Users } from 'lucide-react';
import { useRanked } from '../context/RankedContext';
import { useAuth } from '../auth/AuthGate';
import { TRIVIA_BANK } from '../data/mockData';
import { QUIZ_SIZE, pickQuestions, quizXp } from '../utils/dailyQuiz';
import { disablePush, enablePush, pushEnabled, pushSupported } from '../utils/push';
import { todayKey } from '../utils/memoryTools';

interface Member { name: string; you: boolean; played: boolean; score: number | null; total: number | null }
interface Room { id: string; code: string; name: string; owner: boolean; streak: number; members: Member[] }
interface Me { played: boolean; score: number | null; total: number | null; streak: number }

const card = 'rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4';
const btn = 'min-h-touch px-4 rounded-xl border text-sm font-semibold cursor-pointer disabled:opacity-50';
const primary = `${btn} mem-on border-transparent bg-zinc-950 text-white dark:bg-white dark:text-zinc-950`;
const ghost = `${btn} border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200`;
const input = 'flex-1 min-w-0 min-h-touch px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm';

async function call<T>(path: string, body?: unknown): Promise<{ ok: boolean; data: T & { error?: string } }> {
  const res = await fetch(path, body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: res.ok, data: await res.json() };
}

const Streak: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <span className={`inline-flex items-center gap-1 text-sm font-bold ${n > 0 ? 'text-orange-500' : 'text-zinc-400'}`} aria-label={`${label}: ${n} day${n === 1 ? '' : 's'}`}>
    <Flame className="w-4 h-4" fill={n > 0 ? 'currentColor' : 'none'} aria-hidden="true" /> {n}
  </span>
);

const Quiz: React.FC<{ day: string; streak: number; onFinish: (score: number) => void }> = ({ day, streak, onFinish }) => {
  const questions = React.useMemo(() => pickQuestions(TRIVIA_BANK, day), [day]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = questions[i];
  const answer = (n: number) => { if (picked === null) { setPicked(n); if (n === q.correctIndex) setScore((s) => s + 1); } };
  return (
    <div className={`${card} space-y-3`}>
      <div className="flex justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400"><span>Question {i + 1} of {QUIZ_SIZE}</span><span>{q.category}</span></div>
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{q.question}</p>
      <div className="space-y-2" role="group" aria-label="Answers">
        {q.options.map((o, n) => {
          const right = picked !== null && n === q.correctIndex;
          const wrong = picked === n && n !== q.correctIndex;
          return (
            <button key={n} onClick={() => answer(n)} aria-pressed={picked === n}
              className={`w-full text-left min-h-touch px-3 rounded-xl border text-sm cursor-pointer ${right ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : wrong ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100'}`}>
              {o}{right && ' ✓'}{wrong && ' ✗'}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <p className="text-xs text-zinc-500 dark:text-zinc-400" role="status">{q.explanation}</p>
          <button className={`${primary} w-full`} onClick={() => (i + 1 === QUIZ_SIZE ? onFinish(score) : (setI(i + 1), setPicked(null)))}>
            {i + 1 === QUIZ_SIZE ? `Finish · +${quizXp(score, streak + 1).toLocaleString()} XP` : 'Next question'}
          </button>
        </>
      )}
    </div>
  );
};

export const RoomsView: React.FC = () => {
  const { gainXp } = useRanked();
  const { isGuest, signOut } = useAuth();
  const day = todayKey();
  const [me, setMe] = useState<Me | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');
  const [remind, setRemind] = useState(false);
  const [remindMsg, setRemindMsg] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [m, r] = await Promise.all([call<Me>(`/api/quiz/me?day=${day}`), call<{ rooms: Room[] }>(`/api/rooms/mine?day=${day}`)]);
      if (!m.ok || !r.ok) throw new Error(m.data.error ?? r.data.error);
      setMe(m.data); setRooms(r.data.rooms);
    } catch {
      setError("Couldn't load your rooms. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => {
    if (isGuest) return;
    void load();
    void pushEnabled().then(setRemind).catch(() => setRemind(false));
  }, [isGuest, load]);

  if (isGuest) {
    return (
      <div className={`${card} text-center space-y-3`}>
        <Users className="w-8 h-8 mx-auto text-amber-500" />
        <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">Rooms need an account</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to join a room, keep a daily streak and get reminders.</p>
        <button onClick={() => void signOut()} className={primary}>Sign in or sign up</button>
      </div>
    );
  }

  const finish = async (score: number) => {
    setPlaying(false);
    const r = await call<{ fresh: boolean; streak: number }>('/api/quiz/submit', { day, score, total: QUIZ_SIZE });
    if (r.ok && r.data.fresh) gainXp(quizXp(score, r.data.streak), 'trivia', `Daily quiz ${score}/${QUIZ_SIZE}`);
    await load();
  };

  const act = async (path: string, body: unknown, after?: () => void) => {
    setBusy(true); setError('');
    try {
      const r = await call(path, body);
      if (r.ok) after?.();
      await load(); // load() clears the error line, so set ours after it
      if (!r.ok) setError(r.data.error ?? 'Something went wrong.');
    } catch { setError("Can't reach the server."); } finally { setBusy(false); }
  };

  const share = async (room: Room) => {
    const text = `Join my Ranked quiz room "${room.name}" with code ${room.code}.`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); setCopied(room.id); setTimeout(() => setCopied(''), 1500); }
    } catch { /* the share sheet was dismissed */ }
  };

  const toggleRemind = async () => {
    setRemindMsg('');
    if (remind) { await disablePush(); setRemind(false); return; }
    const err = await enablePush();
    setRemindMsg(err); setRemind(err === '');
  };

  if (loading) return <div className="flex justify-center py-10" role="status" aria-label="Loading"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-rose-500">{error} <button className="underline cursor-pointer" onClick={() => void load()}>Retry</button></p>}

      <section className={`${card} space-y-3`} aria-label="Daily quiz">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-['Outfit'] text-zinc-900 dark:text-zinc-100">Daily Quiz</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Five general-knowledge questions, the same for everyone today.</p>
          </div>
          <Streak n={me?.streak ?? 0} label="Your streak" />
        </div>
        {me?.played
          ? <p className="text-sm text-zinc-700 dark:text-zinc-200"><Check className="inline w-4 h-4 text-emerald-500" /> Done today: <b>{me.score}/{me.total}</b>. Come back tomorrow to keep your streak.</p>
          : !playing && <button className={primary} onClick={() => setPlaying(true)}>Play today's quiz</button>}
      </section>

      {playing && <Quiz day={day} streak={me?.streak ?? 0} onFinish={(s) => void finish(s)} />}

      <section className={`${card} space-y-2`} aria-label="Reminders">
        <button className={`${ghost} w-full inline-flex items-center justify-center gap-2`} onClick={() => void toggleRemind()} aria-pressed={remind}>
          {remind ? <><BellOff className="w-4 h-4" /> Turn off daily reminders</> : <><Bell className="w-4 h-4" /> Remind me daily (7 PM)</>}
        </button>
        {remind && <p className="text-xs text-zinc-500 dark:text-zinc-400">You'll get a notification each evening if you haven't played yet.</p>}
        {remindMsg && <p role="alert" className="text-xs text-rose-500">{remindMsg}</p>}
        {!pushSupported() && <p className="text-xs text-zinc-500 dark:text-zinc-400">Notifications need a supported browser. On iPhone, add Ranked to your Home Screen first.</p>}
      </section>

      {rooms.map((r) => (
        <section key={r.id} className={`${card} space-y-3`} aria-label={`Room ${r.name}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{r.name}</h3>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Code {r.code} · {r.members.length} member{r.members.length === 1 ? '' : 's'}</p>
            </div>
            <Streak n={r.streak} label="Room streak" />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">The room streak grows on days when at least half of the members play.</p>
          <ul className="space-y-1">
            {[...r.members].sort((a, b) => (b.score ?? -1) - (a.score ?? -1)).map((m, k) => (
              <li key={k} className="flex items-center justify-between text-sm text-zinc-800 dark:text-zinc-100">
                <span>{m.name}{m.you && ' (you)'}</span>
                <span className={m.played ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}>{m.played ? `${m.score}/${m.total}` : 'waiting'}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button className={`${ghost} flex-1 inline-flex items-center justify-center gap-1.5`} onClick={() => void share(r)}><Copy className="w-4 h-4" /> {copied === r.id ? 'Copied' : 'Invite'}</button>
            <button className={`${ghost} inline-flex items-center gap-1.5`} disabled={busy} onClick={() => void act('/api/rooms/leave', { roomId: r.id })}><LogOut className="w-4 h-4" /> Leave</button>
          </div>
        </section>
      ))}

      <section className={`${card} space-y-3`} aria-label="Create or join a room">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void act('/api/rooms/create', { name }, () => setName('')); }}>
          <input className={input} aria-label="New room name" placeholder="New room name" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className={`${primary} inline-flex items-center gap-1.5`} disabled={busy}><Plus className="w-4 h-4" /> Create</button>
        </form>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void act('/api/rooms/join', { code }, () => setCode('')); }}>
          <input className={`${input} uppercase font-mono`} aria-label="Room code" placeholder="Room code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
          <button type="submit" className={ghost} disabled={busy}>Join</button>
        </form>
      </section>
    </div>
  );
};
