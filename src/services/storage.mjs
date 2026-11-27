import { key } from '../config/constants.mjs';
import { fresh, validate } from '../models/routine.mjs';

// Inject storage to allow testing without the browser.
export function loadState(storage) {
  const raw = storage.getItem(key);
  if (!raw) return fresh();
  const parsed = JSON.parse(raw);
  const state = validate(parsed);
  const notified = parsed.notified;
  return {
    ...state,
    notified:
      notified && typeof notified === 'object' && !Array.isArray(notified)
        ? Object.fromEntries(Object.entries(notified).filter(([, value]) => value === true))
        : {},
  };
}

export function persistState(storage, state) {
  storage.setItem(key, JSON.stringify(state));
}
