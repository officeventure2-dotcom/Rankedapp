/**
 * Rooms, daily quiz results, room streaks and push reminders.
 *   GET  /api/rooms/mine?day=YYYY-MM-DD      my rooms, members and today's results
 *   POST /api/rooms/create {name, chat?} | /join {code} | /leave {roomId}
 *   GET  /api/rooms/messages?roomId=            chat messages (members only; empty when chat is off)
 *   POST /api/rooms/message {roomId, body}      send a message
 *   POST /api/rooms/chat {roomId, on}           owner turns chat on/off
 *   POST /api/rooms/pin {roomId, messageId, pinned}   owner pins/unpins (max 3)
 *   POST /api/quiz/submit {day, score, total}   one result per user per day
 *   GET  /api/quiz/me?day=                      today's result and my personal streak
 *   GET  /api/push/key, POST /api/push/subscribe {endpoint, keys}, /unsubscribe {endpoint}
 * A room streak grows on a day when at least half of its members have played; a missed day resets it.
 */
import { buildPushPayload } from '@block65/webcrypto-web-push';
import { currentUser, json, readBody, str, type AuthEnv } from './auth';

export interface RoomsEnv extends AuthEnv {
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_ROOMS_PER_USER = 10;
const MAX_OWNED = 5;
const MAX_MEMBERS = 30;
const MAX_PINS = 3;
const MAX_MSG = 500;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export const addDays = (day: string, n: number): string => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const utcToday = () => new Date().toISOString().slice(0, 10);
/** A client's local date may differ from UTC by a day either way, no more. */
const dayOk = (d: string) => DAY_RE.test(d) && Math.abs(Date.parse(`${d}T00:00:00Z`) - Date.parse(`${utcToday()}T00:00:00Z`)) <= 86_400_000;
const effective = (streak: number, lastDay: string, day: string) => (lastDay === day || lastDay === addDays(day, -1) ? streak : 0);

interface RoomRow { id: string; code: string; name: string; owner: string; streak: number; last_day: string; chat: number }

async function myRooms(env: RoomsEnv, userId: string): Promise<RoomRow[]> {
  const r = await env.DB.prepare(
    'SELECT r.id, r.code, r.name, r.owner, r.streak, r.last_day, r.chat FROM rooms r JOIN room_members m ON m.room_id = r.id WHERE m.user_id = ? ORDER BY m.joined'
  ).bind(userId).all<RoomRow>();
  return r.results ?? [];
}

async function personalStreak(env: RoomsEnv, userId: string, day: string): Promise<number> {
  const r = await env.DB.prepare('SELECT day FROM plays WHERE user_id = ? ORDER BY day DESC LIMIT 400').bind(userId).all<{ day: string }>();
  const days = new Set((r.results ?? []).map((x) => x.day));
  let d = days.has(day) ? day : addDays(day, -1);
  let n = 0;
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

async function roomView(env: RoomsEnv, room: RoomRow, day: string, me: string) {
  const m = await env.DB.prepare(
    'SELECT u.id, u.name, p.score, p.total FROM room_members m JOIN users u ON u.id = m.user_id LEFT JOIN plays p ON p.user_id = u.id AND p.day = ? WHERE m.room_id = ? ORDER BY u.name'
  ).bind(day, room.id).all<{ id: string; name: string; score: number | null; total: number | null }>();
  const members = (m.results ?? []).map((x) => ({ name: x.name, you: x.id === me, played: x.score !== null, score: x.score, total: x.total }));
  return { id: room.id, code: room.code, name: room.name, owner: room.owner === me, chat: room.chat === 1, streak: effective(room.streak, room.last_day, day), members };
}

async function bumpRoomStreaks(env: RoomsEnv, userId: string, day: string): Promise<void> {
  for (const room of await myRooms(env, userId)) {
    if (room.last_day === day) continue;
    const c = await env.DB.prepare(
      'SELECT COUNT(*) AS n, SUM(CASE WHEN p.user_id IS NOT NULL THEN 1 ELSE 0 END) AS played FROM room_members m LEFT JOIN plays p ON p.user_id = m.user_id AND p.day = ? WHERE m.room_id = ?'
    ).bind(day, room.id).first<{ n: number; played: number }>();
    if (!c || c.played * 2 < c.n) continue;
    const next = room.last_day === addDays(day, -1) ? room.streak + 1 : 1;
    await env.DB.prepare('UPDATE rooms SET streak = ?, last_day = ? WHERE id = ?').bind(next, day, room.id).run();
  }
}

function newCode(): string {
  const b = crypto.getRandomValues(new Uint8Array(6));
  return [...b].map((x) => CODE_CHARS[x % CODE_CHARS.length]).join('');
}

export async function handleRooms(request: Request, env: RoomsEnv, sameOrigin: (r: Request) => boolean): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const user = await currentUser(request, env);
  if (!user) return json({ error: 'Sign in first.' }, 401);

  if (path === '/api/push/key' && request.method === 'GET') return json({ key: env.VAPID_PUBLIC_KEY ?? '' });
  const day = url.searchParams.get('day') ?? '';

  if (path === '/api/rooms/mine' && request.method === 'GET') {
    if (!dayOk(day)) return json({ error: 'Bad day.' }, 400);
    const rooms = await myRooms(env, user.id);
    return json({ rooms: await Promise.all(rooms.map((r) => roomView(env, r, day, user.id))) });
  }

  if (path === '/api/rooms/messages' && request.method === 'GET') {
    const roomId = url.searchParams.get('roomId') ?? '';
    const room = (await myRooms(env, user.id)).find((r) => r.id === roomId);
    if (!room) return json({ error: 'Not found.' }, 404);
    if (room.chat !== 1) return json({ enabled: false, messages: [] });
    const m = await env.DB.prepare(
      'SELECT g.id, g.user_id, u.name, g.body, g.created, g.pinned FROM messages g JOIN users u ON u.id = g.user_id WHERE g.room_id = ? ORDER BY g.created DESC LIMIT 100'
    ).bind(roomId).all<{ id: string; user_id: string; name: string; body: string; created: number; pinned: number }>();
    const messages = (m.results ?? []).reverse().map((x) => ({ id: x.id, name: x.name, you: x.user_id === user.id, body: x.body, created: x.created, pinned: x.pinned === 1 }));
    return json({ enabled: true, messages });
  }

  if (path === '/api/quiz/me' && request.method === 'GET') {
    if (!dayOk(day)) return json({ error: 'Bad day.' }, 400);
    const p = await env.DB.prepare('SELECT score, total FROM plays WHERE user_id = ? AND day = ?').bind(user.id, day).first<{ score: number; total: number }>();
    return json({ played: !!p, score: p?.score ?? null, total: p?.total ?? null, streak: await personalStreak(env, user.id, day) });
  }

  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  if (!sameOrigin(request)) return json({ error: 'Not allowed.' }, 403);
  const body = await readBody(request);
  if (!body) return json({ error: 'Send JSON.' }, 400);

  if (path === '/api/rooms/create') {
    const name = str(body.name).trim();
    if (name.length < 1 || name.length > 30) return json({ error: 'Enter a room name up to 30 characters.' }, 400);
    const mine = await myRooms(env, user.id);
    if (mine.length >= MAX_ROOMS_PER_USER) return json({ error: `You can be in ${MAX_ROOMS_PER_USER} rooms at most.` }, 400);
    if (mine.filter((r) => r.owner === user.id).length >= MAX_OWNED) return json({ error: `You can own ${MAX_OWNED} rooms at most.` }, 400);
    const id = crypto.randomUUID();
    for (let i = 0; i < 5; i++) {
      try {
        await env.DB.prepare('INSERT INTO rooms (id, code, name, owner, created, chat) VALUES (?, ?, ?, ?, ?, ?)').bind(id, newCode(), name, user.id, Date.now(), body.chat === false ? 0 : 1).run();
        await env.DB.prepare('INSERT INTO room_members (room_id, user_id, joined) VALUES (?, ?, ?)').bind(id, user.id, Date.now()).run();
        return json({ ok: true }, 201);
      } catch (e) {
        if (!/UNIQUE/i.test(String(e))) { console.error(String(e)); return json({ error: 'Could not create the room.' }, 500); }
      }
    }
    return json({ error: 'Could not create the room. Try again.' }, 500);
  }

  if (path === '/api/rooms/join') {
    const code = str(body.code).trim().toUpperCase();
    const room = code.length === 6 ? await env.DB.prepare('SELECT id FROM rooms WHERE code = ?').bind(code).first<{ id: string }>() : null;
    if (!room) return json({ error: 'No room has that code.' }, 404);
    if ((await myRooms(env, user.id)).length >= MAX_ROOMS_PER_USER) return json({ error: `You can be in ${MAX_ROOMS_PER_USER} rooms at most.` }, 400);
    const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM room_members WHERE room_id = ?').bind(room.id).first<{ n: number }>();
    if ((n?.n ?? 0) >= MAX_MEMBERS) return json({ error: 'That room is full.' }, 400);
    await env.DB.prepare('INSERT OR IGNORE INTO room_members (room_id, user_id, joined) VALUES (?, ?, ?)').bind(room.id, user.id, Date.now()).run();
    return json({ ok: true });
  }

  if (path === '/api/rooms/leave') {
    const id = str(body.roomId);
    await env.DB.prepare('DELETE FROM room_members WHERE room_id = ? AND user_id = ?').bind(id, user.id).run();
    const left = await env.DB.prepare('SELECT COUNT(*) AS n FROM room_members WHERE room_id = ?').bind(id).first<{ n: number }>();
    if ((left?.n ?? 0) === 0) {
      await env.DB.prepare('DELETE FROM rooms WHERE id = ?').bind(id).run();
      await env.DB.prepare('DELETE FROM messages WHERE room_id = ?').bind(id).run();
    }
    return json({ ok: true });
  }

  if (path === '/api/rooms/message') {
    const room = (await myRooms(env, user.id)).find((r) => r.id === str(body.roomId));
    if (!room) return json({ error: 'Not found.' }, 404);
    if (room.chat !== 1) return json({ error: 'Chat is off in this room.' }, 403);
    const text = str(body.body).trim();
    if (text.length < 1 || text.length > MAX_MSG) return json({ error: `Messages are 1 to ${MAX_MSG} characters.` }, 400);
    await env.DB.prepare('INSERT INTO messages (id, room_id, user_id, body, created) VALUES (?, ?, ?, ?, ?)').bind(crypto.randomUUID(), room.id, user.id, text, Date.now()).run();
    return json({ ok: true }, 201);
  }

  if (path === '/api/rooms/chat' || path === '/api/rooms/pin') {
    const room = (await myRooms(env, user.id)).find((r) => r.id === str(body.roomId));
    if (!room) return json({ error: 'Not found.' }, 404);
    if (room.owner !== user.id) return json({ error: 'Only the room owner can do that.' }, 403);
    if (path === '/api/rooms/chat') {
      await env.DB.prepare('UPDATE rooms SET chat = ? WHERE id = ?').bind(body.on === true ? 1 : 0, room.id).run();
      return json({ ok: true });
    }
    const pinned = body.pinned === true;
    if (pinned) {
      const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE room_id = ? AND pinned = 1').bind(room.id).first<{ n: number }>();
      if ((n?.n ?? 0) >= MAX_PINS) return json({ error: `You can pin ${MAX_PINS} messages at most. Unpin one first.` }, 400);
    }
    const r = await env.DB.prepare('UPDATE messages SET pinned = ? WHERE id = ? AND room_id = ?').bind(pinned ? 1 : 0, str(body.messageId), room.id).run();
    return (r.meta?.changes ?? 0) > 0 ? json({ ok: true }) : json({ error: 'Not found.' }, 404);
  }

  if (path === '/api/quiz/submit') {
    const d = str(body.day);
    const score = Number(body.score);
    const total = Number(body.total);
    if (!dayOk(d) || !Number.isInteger(total) || total < 1 || total > 10 || !Number.isInteger(score) || score < 0 || score > total) return json({ error: 'Bad result.' }, 400);
    // shortcut: the score is reported by the app, not verified; add server-side answer checking if rankings ever carry prizes.
    const r = await env.DB.prepare('INSERT OR IGNORE INTO plays (user_id, day, score, total) VALUES (?, ?, ?, ?)').bind(user.id, d, score, total).run();
    const fresh = (r.meta?.changes ?? 0) > 0;
    if (fresh) await bumpRoomStreaks(env, user.id, d);
    return json({ fresh, streak: await personalStreak(env, user.id, d) });
  }

  if (path === '/api/push/subscribe') {
    const endpoint = str(body.endpoint);
    const keys = (body.keys ?? {}) as Record<string, unknown>;
    const p256dh = str(keys.p256dh); const auth = str(keys.auth);
    if (!/^https:\/\//.test(endpoint) || endpoint.length > 600 || !p256dh || p256dh.length > 200 || !auth || auth.length > 100) return json({ error: 'Bad subscription.' }, 400);
    await env.DB.prepare('INSERT OR REPLACE INTO pushes (endpoint, user_id, p256dh, auth) VALUES (?, ?, ?, ?)').bind(endpoint, user.id, p256dh, auth).run();
    return json({ ok: true });
  }
  if (path === '/api/push/unsubscribe') {
    await env.DB.prepare('DELETE FROM pushes WHERE endpoint = ? AND user_id = ?').bind(str(body.endpoint), user.id).run();
    return json({ ok: true });
  }
  return json({ error: 'Not found.' }, 404);
}

/** Daily cron: remind everyone in a room who has not played yet. */
export async function sendReminders(env: RoomsEnv, send: (url: string, init: RequestInit) => Promise<Response> = fetch): Promise<number> {
  if (!env.VAPID_PRIVATE_KEY || !env.VAPID_PUBLIC_KEY) return 0;
  const today = utcToday();
  // shortcut: capped at 40 pushes per run (Workers free-plan subrequest limit); page through users when you outgrow it.
  const subs = await env.DB.prepare(
    `SELECT p.endpoint, p.p256dh, p.auth, p.user_id FROM pushes p
     WHERE EXISTS (SELECT 1 FROM room_members m WHERE m.user_id = p.user_id)
       AND NOT EXISTS (SELECT 1 FROM plays y WHERE y.user_id = p.user_id AND y.day >= ?) LIMIT 40`
  ).bind(today).all<{ endpoint: string; p256dh: string; auth: string; user_id: string }>();
  let sent = 0;
  for (const s of subs.results ?? []) {
    const risk = await env.DB.prepare(
      'SELECT MAX(r.streak) AS s FROM rooms r JOIN room_members m ON m.room_id = r.id WHERE m.user_id = ? AND (r.last_day = ? OR r.last_day = ?)'
    ).bind(s.user_id, today, addDays(today, -1)).first<{ s: number | null }>();
    const streak = risk?.s ?? 0;
    const data = JSON.stringify({
      title: 'Ranked daily quiz',
      body: streak > 0 ? `Your room streak is ${streak}. Play today's quiz to keep it alive.` : "Today's quiz is live. Play with your room.",
      url: '/'
    });
    try {
      const payload = await buildPushPayload(
        { data, options: { ttl: 6 * 3600 } },
        { endpoint: s.endpoint, expirationTime: null, keys: { p256dh: s.p256dh, auth: s.auth } },
        { subject: env.VAPID_SUBJECT ?? 'mailto:admin@example.com', publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY }
      );
      const res = await send(s.endpoint, payload);
      if (res.status === 404 || res.status === 410) await env.DB.prepare('DELETE FROM pushes WHERE endpoint = ?').bind(s.endpoint).run();
      else if (res.ok) sent++;
    } catch (e) {
      console.error('push failed', String(e));
    }
  }
  return sent;
}
