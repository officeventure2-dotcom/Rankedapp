import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Apple, Eye, EyeOff, Facebook, Loader2 } from 'lucide-react';

export interface AuthUser { id: string; name: string; email: string }
interface AuthCtx { user: AuthUser | null; signOut: () => Promise<void> }

const Ctx = createContext<AuthCtx>({ user: null, signOut: async () => {} });
export const useAuth = () => useContext(Ctx);

/** Call the auth API. Throws if the server cannot be reached or does not answer JSON. */
async function api(path: string, body?: unknown): Promise<{ status: number; data: { user?: AuthUser; error?: string } }> {
  const res = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin'
  });
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) throw new Error('no-server');
  return { status: res.status, data: await res.json() };
}

type Phase = 'loading' | 'unreachable' | 'signedout' | 'signedin';

/** Shows the sign in / sign up screen until the visitor has a valid session. */
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const check = useCallback(async () => {
    setPhase('loading');
    try {
      const { data } = await api('/api/auth/me');
      if (data.user) { setUser(data.user); setPhase('signedin'); } else setPhase('signedout');
    } catch {
      setPhase('unreachable');
    }
  }, []);
  useEffect(() => { void check(); }, [check]);

  const signOut = useCallback(async () => {
    try { await api('/api/auth/signout', {}); } catch { /* the cookie is cleared by the server when it is reachable */ }
    setUser(null);
    setPhase('signedout');
  }, []);

  if (phase === 'signedin') return <Ctx.Provider value={{ user, signOut }}>{children}</Ctx.Provider>;
  if (phase === 'loading') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950 text-zinc-400" role="status" aria-label="Loading">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (phase === 'unreachable') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center bg-zinc-950 text-zinc-100">
        <h1 className="text-xl font-bold font-['Outfit']">Can't reach Ranked</h1>
        <p className="text-sm text-zinc-400 max-w-xs">Check your internet connection and try again.</p>
        <button onClick={() => void check()} className="min-h-touch px-6 rounded-xl bg-amber-500 text-zinc-950 font-bold cursor-pointer">Try again</button>
      </div>
    );
  }
  return <AuthScreen onDone={(u) => { setUser(u); setPhase('signedin'); }} />;
};

const GoogleG: React.FC = () => (
  <span aria-hidden="true" className="w-5 h-5 rounded-full bg-white text-[#4285F4] text-[13px] font-black flex items-center justify-center">G</span>
);
const XMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL = [
  { name: 'Apple', icon: <Apple className="w-5 h-5" aria-hidden="true" /> },
  { name: 'Google', icon: <GoogleG /> },
  { name: 'Facebook', icon: <Facebook className="w-5 h-5" aria-hidden="true" /> },
  { name: 'X', icon: <XMark /> }
];

const AuthScreen: React.FC<{ onDone: (u: AuthUser) => void }> = ({ onDone }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotice('');
    setBusy(true);
    try {
      const { data } = await api(mode === 'signup' ? '/api/auth/signup' : '/api/auth/signin', mode === 'signup' ? { name, email, password } : { email, password });
      if (data.user) onDone(data.user); else setError(data.error ?? 'Something went wrong. Try again.');
    } catch {
      setError("Can't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };

  const field = 'w-full min-h-touch px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-amber-500';

  return (
    <main className="min-h-dvh flex items-start sm:items-center justify-center px-5 py-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-5">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-black font-['Outfit'] text-zinc-900 dark:text-zinc-50">Ranked</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Level up every part of your life.</p>
        </header>

        <div role="tablist" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/80">
          {(['signup', 'signin'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setError(''); setNotice(''); }}
              className={`min-h-touch rounded-lg text-sm font-bold cursor-pointer ${mode === m ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}
            >
              {m === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input className={field} placeholder="Your name" aria-label="Your name" autoComplete="name" maxLength={40} required value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input className={field} type="email" placeholder="Email" aria-label="Email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input
              className={`${field} pr-12`}
              type={show ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Password (8+ characters)' : 'Password'}
              aria-label="Password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={mode === 'signup' ? 8 : undefined}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-1 top-1/2 -translate-y-1/2 min-h-touch min-w-touch flex items-center justify-center text-zinc-500 cursor-pointer">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p role="alert" className="text-sm text-rose-500">{error}</p>}
          <button type="submit" disabled={busy} className="w-full min-h-touch rounded-xl bg-amber-500 text-zinc-950 font-bold disabled:opacity-60 cursor-pointer">
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" /> or continue with <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SOCIAL.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setNotice(`${s.name} sign-in is coming soon. Use your email for now.`)}
              className="min-h-touch flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        {notice && <p role="status" className="text-center text-xs text-amber-600 dark:text-amber-400">{notice}</p>}
      </div>
    </main>
  );
};
