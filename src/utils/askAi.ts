/** Client for the Worker's /api/ask endpoint (Workers AI). */

export const MAX_QUESTION_CHARS = 500;

export type AskMode = 'home' | 'memory';

export interface HomeAnswer {
  answer: string;
}
export interface MemoryAnswer {
  title: string;
  text: string;
}

const UNAVAILABLE = 'AI search is not available in this preview. It works on the live app.';

export async function askAi(mode: 'home', question: string): Promise<HomeAnswer>;
export async function askAi(mode: 'memory', question: string): Promise<MemoryAnswer>;
export async function askAi(mode: AskMode, question: string): Promise<HomeAnswer | MemoryAnswer> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 40000);
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, question }),
      signal: ctl.signal
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      throw new Error(UNAVAILABLE);
    }
    const data = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : UNAVAILABLE);
    }
    if (mode === 'home' && typeof data.answer === 'string') return { answer: data.answer };
    if (mode === 'memory' && typeof data.text === 'string') {
      return { title: typeof data.title === 'string' ? data.title : question.slice(0, 60), text: data.text };
    }
    throw new Error('The assistant sent back something unexpected. Try again.');
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('That took too long. Check your connection and try again.');
    }
    if (e instanceof TypeError) throw new Error('Could not reach the assistant. Check your connection.');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
