import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Apple, Eye, EyeOff, Facebook, Loader2, Sparkles } from 'lucide-react';
import { Interests, hasInterests } from './Interests';

export interface AuthUser { id: string; name: string; email: string }
interface AuthCtx { user: AuthUser | null; isGuest: boolean; signOut: () => Promise<void> }

const Ctx = createContext<AuthCtx>({ user: null, isGuest: false, signOut: async () => {} });

// A guest has no account; the flag only remembers the choice on this device.
const GUEST_KEY = 'ranked.guest';
const guestFlag = {
  get: () => { try { return localStorage.getItem(GUEST_KEY) === '1'; } catch { return false; } },
  set: (on: boolean) => { try { on ? localStorage.setItem(GUEST_KEY, '1') : localStorage.removeItem(GUEST_KEY); } catch { /* private mode: guest lasts until reload */ } }
};
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

type Phase = 'loading' | 'unreachable' | 'signedout' | 'signedin' | 'guest';

/** Shows the sign in / sign up screen until the visitor has a valid session. */
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [asked, setAsked] = useState(hasInterests);

  const check = useCallback(async () => {
    if (guestFlag.get()) return setPhase('guest');
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
    try { if (!guestFlag.get() && phase === 'signedin') await api('/api/auth/signout', {}); } catch { /* the cookie is cleared by the server when it is reachable */ }
    guestFlag.set(false);
    setUser(null);
    setPhase('signedout');
  }, [phase]);

  if (phase === 'signedin' || phase === 'guest') {
    return (
      <Ctx.Provider value={{ user, isGuest: phase === 'guest', signOut }}>
        {asked ? children : <Interests onDone={() => setAsked(true)} />}
      </Ctx.Provider>
    );
  }
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
        <h1 className="text-xl font-bold font-display">Can't reach Ranked</h1>
        <p className="text-sm text-zinc-400 max-w-xs">Check your internet connection and try again.</p>
        <button onClick={() => void check()} className="min-h-touch px-6 rounded-xl bg-amber-500 text-zinc-950 font-bold cursor-pointer">Try again</button>
      </div>
    );
  }
  return <AuthScreen onDone={(u) => { setUser(u); setPhase('signedin'); }} onGuest={() => { guestFlag.set(true); setUser(null); setPhase('guest'); }} />;
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
  { name: 'Google', icon: <GoogleG /> },
  { name: 'Facebook', icon: <Facebook className="w-5 h-5" aria-hidden="true" /> },
  { name: 'Apple', icon: <Apple className="w-5 h-5" aria-hidden="true" /> },
  { name: 'X', icon: <XMark /> }
];

const field = 'w-full min-h-touch px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-amber-500';
const primaryBtn = 'w-full min-h-[3.25rem] rounded-2xl bg-amber-500 text-zinc-950 font-bold disabled:opacity-60 cursor-pointer';
const darkBtn = 'w-full min-h-[3.25rem] rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2.5 cursor-pointer';

const AuthScreen: React.FC<{ onDone: (u: AuthUser) => void; onGuest: () => void }> = ({ onDone, onGuest }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const signup = mode === 'signup';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotice('');
    setBusy(true);
    try {
      const { data } = await api(signup ? '/api/auth/signup' : '/api/auth/signin', signup ? { name, email, password } : { email, password });
      if (data.user) onDone(data.user); else setError(data.error ?? 'Something went wrong. Try again.');
    } catch {
      setError("Can't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  };
  const swap = () => { setMode(signup ? 'signin' : 'signup'); setError(''); setNotice(''); };

  return (
    <main className="auth-solid min-h-dvh flex justify-center px-6 py-10 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-6">
        <span className="w-11 h-11 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center" aria-hidden="true"><Sparkles className="w-6 h-6" /></span>
        <header className="space-y-2">
          <h1 className="text-[2rem] leading-tight font-extrabold font-display text-zinc-900 dark:text-zinc-50">{signup ? 'Create an account' : 'Welcome back,'}</h1>
          <p className="text-sm text-zinc-400">{signup ? 'It takes less than a minute. Enter your name, email and password.' : 'Good to see you again. Enter your email and password.'}</p>
        </header>

        <form onSubmit={submit} className="space-y-3">
          {signup && <input className={field} placeholder="Name" aria-label="Your name" autoComplete="name" maxLength={40} required value={name} onChange={(e) => setName(e.target.value)} />}
          <input className={field} type="email" placeholder="Email" aria-label="Email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input
              className={`${field} pr-12`}
              type={show ? 'text' : 'password'}
              placeholder={signup ? 'Password (8+ characters)' : 'Password'}
              aria-label="Password"
              autoComplete={signup ? 'new-password' : 'current-password'}
              minLength={signup ? 8 : undefined}
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
          <button type="submit" disabled={busy} className={primaryBtn}>{busy ? 'Please wait…' : signup ? 'Create an Account' : 'Log In'}</button>
        </form>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" /> or <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {signup ? (
          <div className="space-y-2.5">
            {SOCIAL.map((s) => (
              <button key={s.name} type="button" onClick={() => setNotice(`${s.name} sign-in is coming soon. Use your email for now.`)} className={darkBtn}>
                {s.icon} Continue with {s.name}
              </button>
            ))}
          </div>
        ) : (
          <button type="button" onClick={swap} className={darkBtn}>Create an Account</button>
        )}
        {notice && <p role="status" className="text-center text-xs text-amber-600 dark:text-amber-400">{notice}</p>}

        <div className="text-center space-y-1 pt-2">
          {signup && (
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Already have an account? <button type="button" onClick={swap} className="text-amber-600 dark:text-amber-400 cursor-pointer">Log In</button>
            </p>
          )}
          <button type="button" onClick={onGuest} className="min-h-touch px-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400 underline underline-offset-4 cursor-pointer">Continue as guest</button>
          <p className="text-[11px] text-zinc-400">Guest progress stays on this device only.</p>
        </div>
      </div>
    </main>
  );
};
