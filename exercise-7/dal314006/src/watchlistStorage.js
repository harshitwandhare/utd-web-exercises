const STORAGE_KEY = 'watchlist';

// Whatever is sitting under this key, only an array counts.
export function readWatchlist() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}
