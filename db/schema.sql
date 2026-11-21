-- Applied to the D1 database "ranked-auth" (id in wrangler.jsonc).
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, salt TEXT NOT NULL, hash TEXT NOT NULL, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);

-- Rooms, daily quiz results and push subscriptions.
CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, owner TEXT NOT NULL, created INTEGER NOT NULL, streak INTEGER NOT NULL DEFAULT 0, last_day TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS room_members (room_id TEXT NOT NULL, user_id TEXT NOT NULL, joined INTEGER NOT NULL, PRIMARY KEY (room_id, user_id));
CREATE INDEX IF NOT EXISTS room_members_user ON room_members(user_id);
CREATE TABLE IF NOT EXISTS plays (user_id TEXT NOT NULL, day TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, PRIMARY KEY (user_id, day));
CREATE TABLE IF NOT EXISTS pushes (endpoint TEXT PRIMARY KEY, user_id TEXT NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS pushes_user ON pushes(user_id);

-- Room chat: owner can switch it on/off and pin up to 3 messages.
ALTER TABLE rooms ADD COLUMN chat INTEGER NOT NULL DEFAULT 1;
CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, room_id TEXT NOT NULL, user_id TEXT NOT NULL, body TEXT NOT NULL, created INTEGER NOT NULL, pinned INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS messages_room ON messages(room_id, created);

-- Daily Rate moments: visible to friends until `expires` (poster's local midnight); rate/sections come from the AI.
CREATE TABLE IF NOT EXISTS moments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL, kind TEXT NOT NULL, text TEXT NOT NULL, photo TEXT NOT NULL, audio TEXT NOT NULL, rate INTEGER, sections TEXT NOT NULL, summary TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS moments_user ON moments(user_id, expires);

-- Guest Daily Rate tries per connection per day (limits unauthenticated AI use).
CREATE TABLE IF NOT EXISTS guest_uses (ip TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (ip, day));
