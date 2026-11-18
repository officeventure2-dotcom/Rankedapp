/**
 * Email + password accounts on Cloudflare D1.
 *   POST /api/auth/signup  { name, email, password }
 *   POST /api/auth/signin  { email, password }
 *   POST /api/auth/signout
 *   GET  /api/auth/me      -> { user } or 401
 * A session is a random token in an HttpOnly cookie; only its SHA-256 is stored.
 * shortcut: no rate limiting or email verification, add both before a public launch.
 */

interface D1Result<T> { results?: T[] }
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}
export interface AuthEnv { DB: { prepare(sql: string): D1Statement } }

const COOKIE = 'rk_session';
const SESSION_DAYS = 30;
const ITERATIONS = 100_000; // the most Workers allow for PBKDF2
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b as ArrayBuffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
const unhex = (h: string) => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }
  });
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(saltHex), iterations: ITERATIONS }, key, 256);
  return hex(bits);
}

async function sha256(text: string): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(text)));
}

const randomHex = (bytes: number) => hex(crypto.getRandomValues(new Uint8Array(bytes)));

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

function sessionCookie(token: string, maxAge: number): string {
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function readCookie(request: Request): string {
  const m = (request.headers.get('Cookie') ?? '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`));
  return m ? m[1] : '';
}

async function startSession(env: AuthEnv, userId: string): Promise<string> {
  const token = randomHex(32);
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires) VALUES (?, ?, ?)').bind(await sha256(token), userId, expires).run();
  return sessionCookie(token, SESSION_DAYS * 86_400);
}

async function currentUser(request: Request, env: AuthEnv): Promise<{ id: string; name: string; email: string } | null> {
  const token = readCookie(request);
  if (!token) return null;
  return env.DB.prepare(
    'SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires > ?'
  ).bind(await sha256(token), Date.now()).first<{ id: string; name: string; email: string }>();
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > 2048) return null;
    const v = JSON.parse(text);
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

export async function handleAuth(request: Request, env: AuthEnv, sameOrigin: (r: Request) => boolean): Promise<Response> {
  const path = new URL(request.url).pathname;

  if (path === '/api/auth/me') {
    if (request.method !== 'GET') return json({ error: 'Use GET.' }, 405);
    const user = await currentUser(request, env);
    return user ? json({ user }) : json({ error: 'Not signed in.' }, 401);
  }

  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  if (!sameOrigin(request)) return json({ error: 'Not allowed.' }, 403);

  if (path === '/api/auth/signout') {
    const token = readCookie(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
  }

  const body = await readBody(request);
  if (!body) return json({ error: 'Send JSON.' }, 400);
  const email = str(body.email).trim().toLowerCase();
  const password = str(body.password);

  if (path === '/api/auth/signup') {
    const name = str(body.name).trim();
    if (name.length < 1 || name.length > 40) return json({ error: 'Enter a name up to 40 characters.' }, 400);
    if (email.length > 254 || !EMAIL_RE.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
    if (password.length < 8 || password.length > 128) return json({ error: 'Use a password of 8 to 128 characters.' }, 400);
    const salt = randomHex(16);
    const id = crypto.randomUUID();
    const hash = await hashPassword(password, salt);
    try {
      await env.DB.prepare('INSERT INTO users (id, email, name, salt, hash, created) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, email, name, salt, hash, Date.now()).run();
    } catch (e) {
      if (!/UNIQUE/i.test(String(e))) {
        console.error(String(e));
        return json({ error: 'Could not create the account. Try again.' }, 500);
      }
      return json({ error: 'An account with that email already exists. Sign in instead.' }, 409);
    }
    return json({ user: { id, name, email } }, 201, { 'Set-Cookie': await startSession(env, id) });
  }

  if (path === '/api/auth/signin') {
    const row = email && password.length <= 128
      ? await env.DB.prepare('SELECT id, name, email, salt, hash FROM users WHERE email = ?').bind(email).first<{ id: string; name: string; email: string; salt: string; hash: string }>()
      : null;
    // Hash even for unknown emails so response time does not reveal which emails exist.
    const computed = await hashPassword(password.slice(0, 128), row?.salt ?? '00'.repeat(16));
    if (!row || !safeEqual(computed, row.hash)) return json({ error: 'Wrong email or password.' }, 401);
    return json({ user: { id: row.id, name: row.name, email: row.email } }, 200, { 'Set-Cookie': await startSession(env, row.id) });
  }

  return json({ error: 'Not found.' }, 404);
}
