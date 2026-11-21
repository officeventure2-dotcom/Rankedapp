/**
 * Ranked's tiny API. Everything that is not /api/* is served by Workers Static
 * Assets (see wrangler.jsonc), so this Worker only runs for /api/ask.
 *
 * POST /api/ask  { mode: 'home' | 'memory', question: string }
 *   home   -> { answer: string }
 *   memory -> { title: string, text: string }
 */

import { handleAuth } from './auth';
import { handleDaily } from './daily';
import { handleRooms, sendReminders, type RoomsEnv } from './rooms';

// Minimal local types so the app's `tsc --noEmit` needs no extra packages.
interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}
interface Env extends RoomsEnv {
  AI: AiBinding;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export const MODEL = '@cf/meta/llama-3.1-8b-instruct';
export const MAX_QUESTION_CHARS = 500;
const MAX_BODY_BYTES = 4096;

const HOME_SYSTEM = [
  'You are the built-in assistant of Ranked, a self-improvement app covering knowledge, psychology, memory, languages, books, fitness and games.',
  'Answer the question clearly and honestly in plain text, in at most about 180 words. Short paragraphs or a short "-" list are fine. No markdown headings or tables.',
  'If you are not sure of a fact, say so instead of guessing. For health, legal or money questions give general information and suggest a professional for decisions.',
  'Do not help with anything that could seriously harm someone. Do not write out the text of the Quran or other scripture; for that, tell the person to use the Quran option in Memory Mode.'
].join(' ');

const MEMORY_SYSTEM = [
  'You help someone build a short text to memorize inside the Memory Mode of an app.',
  'Reply with ONLY a JSON object: {"title": "...", "text": "..."} and nothing else.',
  '"title" is at most 60 characters. "text" is the material to memorize, at most 1200 characters, with line breaks written as \\n.',
  'Good material: a public-domain poem or famous speech excerpt (published before 1930), a list (planets, presidents, elements, the Greek alphabet), a definition, a formula set, key dates, vocabulary, or a short study summary you write yourself.',
  'Never reproduce copyrighted song lyrics, poems or book passages; write a short original summary or a list of facts instead and say so in the title.',
  'Never write out the Quran or other scripture; instead put in "text" the single sentence: Use the Quran option in Memory Mode.',
  'If you are not certain a quotation is exact, write a summary instead of inventing a quotation.'
].join(' ');

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/** Pull the generated text out of whichever shape Workers AI returned. */
export function extractText(result: unknown): string {
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object') {
    const r = result as Record<string, unknown>;
    if (typeof r.response === 'string') return r.response;
    if (r.response && typeof r.response === 'object') return JSON.stringify(r.response);
    const choices = r.choices as Array<{ message?: { content?: unknown } }> | undefined;
    const content = choices?.[0]?.message?.content;
    if (typeof content === 'string') return content;
    const nested = r.result as Record<string, unknown> | undefined;
    if (nested && typeof nested.response === 'string') return nested.response;
  }
  return '';
}

/** Read {title, text} from model output, tolerating code fences or stray prose. */
export function parseMemory(raw: string, fallbackTitle: string): { title: string; text: string } {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      const obj = JSON.parse(raw.slice(start, end + 1)) as { title?: unknown; text?: unknown };
      const text = typeof obj.text === 'string' ? obj.text.trim() : '';
      if (text) {
        const title = typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : fallbackTitle;
        return { title: title.slice(0, 60), text: text.slice(0, 2000) };
      }
    } catch {
      /* fall through to the plain-text fallback */
    }
  }
  const text = raw.replace(/```[a-z]*\n?|```/gi, '').trim();
  return { title: fallbackTitle.slice(0, 60), text: text.slice(0, 2000) };
}

/** Same-origin check so other websites cannot spend this app's AI allowance from a browser. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // non-browser callers carry no Origin
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function handleAsk(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  if (!sameOrigin(request)) return json({ error: 'Not allowed.' }, 403);

  const lengthHeader = Number(request.headers.get('Content-Length') ?? 0);
  if (lengthHeader > MAX_BODY_BYTES) return json({ error: 'That request is too large.' }, 413);

  let body: { mode?: unknown; question?: unknown };
  try {
    const textBody = await request.text();
    if (textBody.length > MAX_BODY_BYTES) return json({ error: 'That request is too large.' }, 413);
    body = JSON.parse(textBody);
  } catch {
    return json({ error: 'Send JSON like {"mode":"home","question":"..."}.' }, 400);
  }

  const mode = body.mode === 'memory' ? 'memory' : body.mode === 'home' ? 'home' : null;
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!mode) return json({ error: 'Unknown mode.' }, 400);
  if (question.length < 2) return json({ error: 'Type a question first.' }, 400);
  if (question.length > MAX_QUESTION_CHARS) {
    return json({ error: `Keep it under ${MAX_QUESTION_CHARS} characters.` }, 400);
  }

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: mode === 'home' ? HOME_SYSTEM : MEMORY_SYSTEM },
        { role: 'user', content: question }
      ],
      max_tokens: mode === 'home' ? 450 : 800,
      temperature: mode === 'home' ? 0.5 : 0.3
    });
    const text = extractText(result).trim();
    if (!text) return json({ error: 'The assistant sent back nothing. Try again.' }, 502);
    if (mode === 'home') return json({ answer: text });
    return json(parseMemory(text, question));
  } catch {
    return json({ error: 'The assistant is busy right now. Try again in a moment.' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/auth/')) return handleAuth(request, env, sameOrigin);
    if (/^\/api\/(rooms|quiz|push)\//.test(url.pathname)) return handleRooms(request, env, sameOrigin);
    if (url.pathname.startsWith('/api/daily/')) return handleDaily(request, env, sameOrigin);
    if (url.pathname === '/api/ask') return handleAsk(request, env);
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404);
    return env.ASSETS.fetch(request);
  },
  // Daily cron (wrangler.jsonc triggers): push reminders to room members who have not played.
  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<void> {
    ctx.waitUntil(sendReminders(env));
  }
};
