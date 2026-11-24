/**
 * Book Store data, proxied so the browser never needs the sources' CORS:
 *   GET /api/books/search?source=free&q=   free classics (Project Gutenberg via Gutendex)
 *   GET /api/books/search?source=store&q=  paid ebooks (Google Books: price + buy link + preview)
 *   GET /api/books/text?id=1342            full text of a free book (Project Gutenberg)
 * Buying happens at the seller's own page. Set AFFILIATE_QUERY (e.g. "&aff=abc") to add your commission id to buy links.
 */
import { json } from './auth';

export interface BookCard {
  id: string;
  title: string;
  author: string;
  cover: string;
  /** free books: Gutenberg id to read in the app */
  gutenbergId?: number;
  /** paid books */
  price?: string;
  buyUrl?: string;
  previewUrl?: string;
}

const HTTPS = (u: unknown) => (typeof u === 'string' && u.startsWith('http://') ? 'https://' + u.slice(7) : typeof u === 'string' && u.startsWith('https://') ? u : '');
const money = (p: { amount?: number; currencyCode?: string } | undefined) =>
  p && typeof p.amount === 'number' && p.currencyCode ? new Intl.NumberFormat('en', { style: 'currency', currency: p.currencyCode }).format(p.amount) : '';

/** Gutendex result -> card. Skips entries with no readable text. */
export function freeCards(data: unknown): BookCard[] {
  const rows = (data as { results?: Record<string, unknown>[] })?.results ?? [];
  return rows.flatMap((b) => {
    const id = Number(b.id);
    const formats = (b.formats ?? {}) as Record<string, string>;
    if (!Number.isInteger(id) || !Object.keys(formats).some((k) => k.startsWith('text/'))) return [];
    const authors = (b.authors as { name?: string }[] | undefined) ?? [];
    return [{ id: `gb-${id}`, gutenbergId: id, title: String(b.title ?? 'Untitled'), author: (authors[0]?.name ?? 'Unknown').replace(/^(.+), (.+)$/, '$2 $1'), cover: HTTPS(formats['image/jpeg']) }];
  });
}

/** Google Books volume -> card. Only titles actually for sale. */
export function storeCards(data: unknown, affiliate = ''): BookCard[] {
  const rows = (data as { items?: Record<string, any>[] })?.items ?? [];
  return rows.flatMap((v) => {
    const sale = v.saleInfo ?? {};
    const price = money(sale.retailPrice ?? sale.listPrice);
    if (sale.saleability !== 'FOR_SALE' || !price || !HTTPS(sale.buyLink)) return [];
    const info = v.volumeInfo ?? {};
    const access = v.accessInfo ?? {};
    return [{
      id: `gv-${v.id}`, title: String(info.title ?? 'Untitled'), author: (info.authors ?? ['Unknown']).join(', '),
      cover: HTTPS(info.imageLinks?.thumbnail), price, buyUrl: HTTPS(sale.buyLink) + affiliate,
      previewUrl: access.viewability && access.viewability !== 'NO_PAGES' ? HTTPS(access.webReaderLink) : undefined
    }];
  });
}

/** Cut the Project Gutenberg licence boilerplate off both ends. */
export function stripGutenberg(raw: string): string {
  const start = raw.search(/\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/);
  const end = raw.search(/\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG/);
  const from = start >= 0 ? raw.indexOf('\n', start) + 1 : 0;
  return raw.slice(from, end > from ? end : undefined).trim();
}

const cached = (url: string) => fetch(url, { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit);
const MAX_TEXT = 3_000_000;

export async function handleBooks(request: Request, env: { AFFILIATE_QUERY?: string }): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== 'GET') return json({ error: 'Not found.' }, 404);

  if (url.pathname === '/api/books/search') {
    const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
    const source = url.searchParams.get('source');
    try {
      if (source === 'free') {
        const r = await cached(`https://gutendex.com/books?languages=en${q ? `&search=${encodeURIComponent(q)}` : ''}`);
        return r.ok ? json({ books: freeCards(await r.json()).slice(0, 24) }) : json({ error: 'The free library is unavailable right now.' }, 502);
      }
      if (source === 'store') {
        const r = await cached(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q || 'subject:fiction')}&filter=paid-ebooks&maxResults=24&printType=books`);
        return r.ok ? json({ books: storeCards(await r.json(), env.AFFILIATE_QUERY ?? '') }) : json({ error: 'The store is unavailable right now.' }, 502);
      }
    } catch { return json({ error: 'The book source could not be reached.' }, 502); }
    return json({ error: 'Unknown source.' }, 400);
  }

  if (url.pathname === '/api/books/text') {
    const id = url.searchParams.get('id') ?? '';
    if (!/^\d{1,7}$/.test(id)) return json({ error: 'Bad id.' }, 400);
    try {
      const r = await cached(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
      if (!r.ok) return json({ error: 'That book has no readable text.' }, 404);
      return json({ text: stripGutenberg((await r.text()).slice(0, MAX_TEXT)) });
    } catch { return json({ error: 'The book source could not be reached.' }, 502); }
  }

  return json({ error: 'Not found.' }, 404);
}
