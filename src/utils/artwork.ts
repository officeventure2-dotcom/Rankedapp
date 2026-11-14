/**
 * Original, offline SVG artwork for avatars and book covers.
 * Everything is generated deterministically from a seed (a name or title),
 * so the same person or book always gets the same picture and nothing
 * depends on a remote image host.
 */

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(list: T[], h: number, shift: number): T {
  return list[Math.floor(h / 2 ** shift) % list.length];
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** True for images bundled with the app (served from our own origin) or inline data. */
export function isLocalImage(src: string | undefined): boolean {
  if (!src) return false;
  if (src.startsWith('data:')) return true;
  return src.startsWith('/') && !src.startsWith('//');
}

const SKIN_TONES = ['#f1c9a5', '#e0a982', '#c68a62', '#a56a45', '#80502f', '#5c3a22'];
const HAIR_COLORS = ['#1c1917', '#44403c', '#7c4a1e', '#b45309', '#d6a85b', '#9ca3af'];

/** A friendly illustrated head-and-shoulders portrait, 96x96. */
export function avatarArt(seed: string): string {
  const h = hash(seed || 'player');
  const hue = h % 360;
  const skin = pick(SKIN_TONES, h, 3);
  const hair = pick(HAIR_COLORS, h, 7);
  const style = Math.floor(h / 2 ** 11) % 4;
  const shirtHue = (hue + 150) % 360;

  const hairBack =
    style === 1
      ? `<path d="M26 52c-4-26 8-38 22-38s26 12 22 38c-3-10-8-14-22-14s-19 4-22 14z" fill="${hair}"/>`
      : style === 3
        ? `<rect x="24" y="30" width="48" height="40" rx="20" fill="${hair}"/>`
        : '';
  const hairFront =
    style === 0
      ? `<path d="M30 40c0-14 8-20 18-20s18 6 18 20c-6-6-12-8-18-8s-12 2-18 8z" fill="${hair}"/>`
      : style === 1
        ? `<path d="M30 42c2-12 10-18 18-18s16 6 18 18c-8-5-12-8-18-8s-10 3-18 8z" fill="${hair}"/>`
        : style === 2
          ? `<path d="M31 38c1-12 9-18 17-18s16 6 17 18c-4-3-8-4-10-9-5 6-14 9-24 9z" fill="${hair}"/>`
          : `<path d="M30 40c2-13 9-19 18-19s16 6 18 19c-7-5-12-6-18-6s-11 1-18 6z" fill="${hair}"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue},58%,36%)"/>
<stop offset="1" stop-color="hsl(${(hue + 40) % 360},62%,16%)"/>
</linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.35" r="0.6">
<stop offset="0" stop-color="#fff" stop-opacity="0.28"/>
<stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="96" height="96" fill="url(#bg)"/>
<rect width="96" height="96" fill="url(#glow)"/>
${hairBack}
<path d="M12 96c2-20 16-28 36-28s34 8 36 28z" fill="hsl(${shirtHue},48%,42%)"/>
<path d="M40 68h16l-8 10z" fill="${skin}"/>
<rect x="42" y="56" width="12" height="14" rx="5" fill="${skin}"/>
<ellipse cx="48" cy="44" rx="17" ry="19" fill="${skin}"/>
${hairFront}
<circle cx="41.5" cy="45" r="1.8" fill="#1c1917"/>
<circle cx="54.5" cy="45" r="1.8" fill="#1c1917"/>
<path d="M42.5 53c3 3 8 3 11 0" stroke="#1c1917" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.7"/>
</svg>`;
  return toDataUri(svg);
}

function wrapTitle(title: string, maxChars: number, maxLines: number): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxChars - 1)}…`;
    return kept;
  }
  return lines;
}

function shade(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** An original typographic book cover, 120x170. */
export function bookCoverArt(title: string, author: string, baseColor?: string): string {
  const h = hash(`${title}|${author}`);
  const base = /^#[0-9a-f]{6}$/i.test(baseColor ?? '')
    ? (baseColor as string)
    : `#${[
        Math.round(40 + (h % 120)),
        Math.round(40 + ((h >> 8) % 110)),
        Math.round(60 + ((h >> 16) % 130)),
      ]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
  const dark = shade(base, -70);
  const light = shade(base, 60);
  const emblem = h % 4;
  const lines = wrapTitle(title, 13, 3);
  const startY = 108 - (lines.length - 1) * 8;

  const art =
    emblem === 0
      ? `<circle cx="60" cy="52" r="26" fill="none" stroke="${light}" stroke-width="1.6" opacity="0.7"/><circle cx="60" cy="52" r="17" fill="none" stroke="${light}" stroke-width="1.6" opacity="0.7"/><circle cx="60" cy="52" r="8" fill="${light}" opacity="0.8"/>`
      : emblem === 1
        ? `<path d="M60 22l28 30-28 30-28-30z" fill="none" stroke="${light}" stroke-width="1.8" opacity="0.8"/><path d="M60 34l16 18-16 18-16-18z" fill="${light}" opacity="0.6"/>`
        : emblem === 2
          ? `<path d="M34 76l26-50 26 50z" fill="none" stroke="${light}" stroke-width="1.8" opacity="0.8"/><path d="M46 76l14-27 14 27z" fill="${light}" opacity="0.6"/>`
          : `<g stroke="${light}" stroke-width="1.6" opacity="0.75" fill="none"><path d="M30 30h60M30 44h60M30 58h60M30 72h60"/><path d="M40 24v54M60 24v54M80 24v54"/></g>`;

  const titleText = lines
    .map(
      (line, i) =>
        `<text x="66" y="${startY + i * 16}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#fff">${escapeXml(line)}</text>`
    )
    .join('');

  const authorText = escapeXml(author.length > 22 ? `${author.slice(0, 21)}…` : author);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 170">
<defs>
<linearGradient id="cv" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${base}"/>
<stop offset="1" stop-color="${dark}"/>
</linearGradient>
</defs>
<rect width="120" height="170" rx="6" fill="url(#cv)"/>
<rect width="12" height="170" rx="3" fill="#000" opacity="0.28"/>
<rect x="12" width="1.5" height="170" fill="#fff" opacity="0.18"/>
<g transform="translate(6,-8)">${art}</g>
${titleText}
<rect x="40" y="136" width="52" height="1.4" fill="${light}" opacity="0.8"/>
<text x="66" y="152" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="8.5" fill="#fff" opacity="0.85">${authorText}</text>
</svg>`;
  return toDataUri(svg);
}
