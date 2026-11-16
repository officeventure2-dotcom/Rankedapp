/**
 * Pictures for Photo Memory beyond the built-in icons:
 *  - a set of real photographs loaded from Lorem Picsum (seeded, so the same seed is always the same photo)
 *  - the person's own photos, shrunk on this device and saved in localStorage (never uploaded)
 */

export const MIN_OWN_PHOTOS = 8;
export const FULL_OWN_PHOTOS = 15;
export const MAX_OWN_PHOTOS = 60;
const THUMB = 240;
const OWN_KEY = 'ranked.photomem.photos.v1';

export interface OwnPhoto {
  id: string;
  src: string;
}

/** 28 real photographs, loaded when needed. */
export const WEB_PHOTO_URLS: string[] = Array.from(
  { length: 28 },
  (_, i) => `https://picsum.photos/seed/ranked-memory-${i + 1}/${THUMB}/${THUMB}`
);

export function loadOwnPhotos(): OwnPhoto[] {
  try {
    const raw = window.localStorage.getItem(OWN_KEY);
    if (raw) {
      const list: unknown = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list
          .filter((p): p is OwnPhoto => !!p && typeof p.id === 'string' && typeof p.src === 'string' && p.src.startsWith('data:image/'))
          .slice(0, MAX_OWN_PHOTOS);
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

/** Returns false when the browser would not store it (storage full or blocked). */
export function saveOwnPhotos(list: OwnPhoto[]): boolean {
  try {
    window.localStorage.setItem(OWN_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** Centre-crop to a square and shrink to a small JPEG data URL. */
export async function fileToThumb(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('not an image');
  let source: CanvasImageSource & { width: number; height: number };
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      source = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('unreadable'));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const side = Math.min(source.width, source.height);
  const canvas = document.createElement('canvas');
  canvas.width = THUMB;
  canvas.height = THUMB;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.drawImage(source, (source.width - side) / 2, (source.height - side) / 2, side, side, 0, 0, THUMB, THUMB);
  return canvas.toDataURL('image/jpeg', 0.78);
}

const warm = new Set<string>();

/** Resolve true once every image is decoded, false if any fails or it takes too long. */
export function preloadImages(urls: string[], timeoutMs = 12000): Promise<boolean> {
  const todo = urls.filter((u) => !warm.has(u));
  if (todo.length === 0) return Promise.resolve(true);
  const all = Promise.all(
    todo.map(
      (u) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => {
            warm.add(u);
            resolve(true);
          };
          img.onerror = () => resolve(false);
          img.src = u;
        })
    )
  ).then((r) => r.every(Boolean));
  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs));
  return Promise.race([all, timeout]);
}
