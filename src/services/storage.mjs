import { key } from '../config/constants.mjs';
import { fresh, validate } from '../models/routine.mjs';

// Inject storage to allow testing without the browser.
export function loadState(storage) {
  const raw = storage.getItem(key);
  if (!raw) return fresh();
  const parsed = JSON.parse(raw);
  return { ...validate(parsed), notified: parsed.notified || {} };
}

export function persistState(storage, state) {
  storage.setItem(key, JSON.stringify(state));
}
