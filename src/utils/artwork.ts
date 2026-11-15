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

export type FactTopic =
  | 'space'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'body'
  | 'earth'
  | 'history'
  | 'tech'
  | 'math'
  | 'mind';

/** Base hue per topic, so each subject has a recognisable colour. */
export const TOPIC_HUE: Record<FactTopic, number> = {
  space: 255,
  physics: 200,
  chemistry: 160,
  biology: 120,
  body: 350,
  earth: 30,
  history: 42,
  tech: 185,
  math: 285,
  mind: 320
};

function scene(topic: FactTopic, h: number, hue: number): string {
  const light = `hsl(${hue},85%,78%)`;
  const mid = `hsl(${hue},70%,58%)`;
  const dark = `hsl(${hue},60%,32%)`;
  const accent = `hsl(${(hue + 40) % 360},90%,70%)`;
  const r = (n: number, shift: number) => ((h >> shift) % n);

  switch (topic) {
    case 'space': {
      const stars = Array.from({ length: 36 }, (_, i) => {
        const x = (hash(`s${h}x${i}`) % 320);
        const y = (hash(`s${h}y${i}`) % 200);
        const s = 0.6 + (hash(`s${h}r${i}`) % 14) / 10;
        return `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff" opacity="${0.35 + (i % 5) * 0.13}"/>`;
      }).join('');
      const cx = 120 + r(80, 3);
      return `${stars}<circle cx="${cx}" cy="104" r="46" fill="url(#orb)"/><ellipse cx="${cx}" cy="104" rx="84" ry="16" fill="none" stroke="${accent}" stroke-width="5" opacity="0.7" transform="rotate(-18 ${cx} 104)"/><circle cx="${cx + 70}" cy="44" r="9" fill="${light}" opacity="0.9"/>`;
    }
    case 'physics': {
      const rot = r(60, 2);
      return `<g transform="translate(160 100) rotate(${rot})" fill="none" stroke="${light}" stroke-width="2.4" opacity="0.9"><ellipse rx="86" ry="30"/><ellipse rx="86" ry="30" transform="rotate(60)"/><ellipse rx="86" ry="30" transform="rotate(120)"/></g><circle cx="160" cy="100" r="13" fill="${accent}"/><circle cx="244" cy="100" r="6" fill="#fff"/><circle cx="118" cy="${28 + r(10, 5)}" r="6" fill="#fff"/><circle cx="118" cy="172" r="6" fill="#fff"/>`;
    }
    case 'chemistry': {
      const hex = (cx: number, cy: number, rad: number, fill: string) => {
        const p = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
        }).join(' ');
        return `<polygon points="${p}" fill="${fill}" stroke="${light}" stroke-width="2.4" stroke-linejoin="round"/>`;
      };
      const dots = [[160, 100], [100, 134], [220, 66], [220, 134], [100, 66]]
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 0 ? 9 : 6}" fill="${i % 2 ? accent : '#fff'}"/>`)
        .join('');
      return `${hex(160, 100, 52, 'none')}${hex(224, 63, 34, `${mid}55`)}${hex(96, 137, 34, `${mid}55`)}${dots}`;
    }
    case 'biology': {
      const rungs: string[] = [];
      let a = '';
      let b = '';
      for (let x = 0; x <= 320; x += 4) {
        const y1 = 100 + 46 * Math.sin((x + r(40, 4)) / 22);
        const y2 = 100 - 46 * Math.sin((x + r(40, 4)) / 22);
        a += `${x === 0 ? 'M' : 'L'}${x} ${y1.toFixed(1)} `;
        b += `${x === 0 ? 'M' : 'L'}${x} ${y2.toFixed(1)} `;
        if (x % 20 === 0) rungs.push(`<line x1="${x}" y1="${y1.toFixed(1)}" x2="${x}" y2="${y2.toFixed(1)}" stroke="${light}" stroke-width="2" opacity="0.55"/>`);
      }
      return `${rungs.join('')}<path d="${a}" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/><path d="${b}" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round"/>`;
    }
    case 'body': {
      const cells = Array.from({ length: 14 }, (_, i) => {
        const x = 20 + (hash(`c${h}x${i}`) % 280);
        const y = 20 + (hash(`c${h}y${i}`) % 160);
        const s = 8 + (hash(`c${h}r${i}`) % 16);
        return `<circle cx="${x}" cy="${y}" r="${s}" fill="${mid}" opacity="0.28"/><circle cx="${x}" cy="${y}" r="${s * 0.4}" fill="${light}" opacity="0.45"/>`;
      }).join('');
      return `${cells}<path d="M0 104h92l14-42 22 86 18-70 12 26h162" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    case 'earth': {
      return `<circle cx="${220 + r(40, 3)}" cy="58" r="26" fill="${accent}" opacity="0.95"/><path d="M0 150l50-62 38 40 52-84 56 80 40-34 84 60v50H0z" fill="${mid}"/><path d="M0 172l60-40 50 28 64-48 70 52 76-30v66H0z" fill="${dark}"/><path d="M0 186c40-8 80 8 120 0s80-8 120 0 60 6 80 0v14H0z" fill="${light}" opacity="0.55"/>`;
    }
    case 'history': {
      const cols = [64, 112, 160, 208, 256]
        .map((x) => `<rect x="${x - 9}" y="74" width="18" height="76" rx="3" fill="${light}" opacity="0.92"/><rect x="${x - 13}" y="68" width="26" height="8" rx="2" fill="${light}"/><rect x="${x - 13}" y="148" width="26" height="8" rx="2" fill="${light}"/>`)
        .join('');
      return `<path d="M40 68L160 22l120 46z" fill="${mid}"/>${cols}<rect x="34" y="158" width="252" height="12" rx="3" fill="${light}"/><rect x="24" y="172" width="272" height="10" rx="3" fill="${accent}" opacity="0.8"/>`;
    }
    case 'tech': {
      const traces = Array.from({ length: 7 }, (_, i) => {
        const y = 26 + i * 24;
        const x1 = 20 + (hash(`t${h}a${i}`) % 90);
        const x2 = x1 + 60 + (hash(`t${h}b${i}`) % 120);
        const y2 = y + ((hash(`t${h}c${i}`) % 3) - 1) * 24;
        return `<path d="M0 ${y}H${x1}L${x1 + 24} ${y2}H${x2}L${x2 + 20} ${y}H320" fill="none" stroke="${i % 2 ? light : accent}" stroke-width="2.6" opacity="0.75"/><circle cx="${x2 + 20}" cy="${y}" r="4.5" fill="#fff"/>`;
      }).join('');
      return `${traces}<rect x="124" y="70" width="72" height="60" rx="8" fill="${dark}" stroke="${accent}" stroke-width="3"/><rect x="142" y="86" width="36" height="28" rx="4" fill="${accent}" opacity="0.85"/>`;
    }
    case 'math': {
      let spiral = '';
      for (let t = 0; t < 7.5; t += 0.12) {
        const rad = 5 * Math.pow(1.34, t);
        const x = 168 + rad * Math.cos(t * 1.9 + h % 6);
        const y = 100 + rad * Math.sin(t * 1.9 + h % 6);
        spiral += `${t === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      const grid = Array.from({ length: 9 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="200" stroke="${light}" stroke-width="1" opacity="0.14"/>`).join('') +
        Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="320" y2="${i * 40}" stroke="${light}" stroke-width="1" opacity="0.14"/>`).join('');
      return `${grid}<path d="${spiral}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/><circle cx="168" cy="100" r="5" fill="#fff"/>`;
    }
    case 'mind': {
      const pts = Array.from({ length: 11 }, (_, i) => [
        30 + (hash(`m${h}x${i}`) % 260),
        24 + (hash(`m${h}y${i}`) % 152)
      ]);
      const links = pts
        .flatMap((p, i) => pts.slice(i + 1).map((q) => ({ p, q, d: Math.hypot(p[0] - q[0], p[1] - q[1]) })))
        .filter((l) => l.d < 100)
        .map((l) => `<line x1="${l.p[0]}" y1="${l.p[1]}" x2="${l.q[0]}" y2="${l.q[1]}" stroke="${light}" stroke-width="1.8" opacity="0.5"/>`)
        .join('');
      const nodes = pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 9 : 6}" fill="${i % 3 === 0 ? accent : '#fff'}"/>`).join('');
      return `${links}${nodes}`;
    }
  }
}

/** An original illustrated 16:10 picture for a fact card. */
export function factArt(topic: FactTopic, seed: string): string {
  const h = hash(`${topic}|${seed}`);
  const hue = (TOPIC_HUE[topic] + (h % 24) - 12 + 360) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue},62%,26%)"/>
<stop offset="1" stop-color="hsl(${(hue + 50) % 360},68%,10%)"/>
</linearGradient>
<radialGradient id="orb" cx="0.35" cy="0.3" r="0.8">
<stop offset="0" stop-color="hsl(${hue},90%,78%)"/>
<stop offset="1" stop-color="hsl(${(hue + 30) % 360},70%,30%)"/>
</radialGradient>
<radialGradient id="glow" cx="0.5" cy="0.45" r="0.6">
<stop offset="0" stop-color="hsl(${hue},90%,70%)" stop-opacity="0.35"/>
<stop offset="1" stop-color="hsl(${hue},90%,70%)" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="320" height="200" fill="url(#bg)"/>
<rect width="320" height="200" fill="url(#glow)"/>
${scene(topic, h, hue)}
</svg>`;
  return toDataUri(svg);
}
