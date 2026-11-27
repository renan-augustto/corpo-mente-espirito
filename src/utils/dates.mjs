// Calendar dates use local civil time, not UTC midnight.
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const dateObj = (key) => new Date(key + 'T12:00:00');
export const today = () => dateKey(new Date());
export function shift(key, days) {
  const date = dateObj(key);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export const fmt = (key) =>
  dateObj(key).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);
export const hh = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export function validDate(key) {
  return (
    typeof key === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(key) &&
    !isNaN(dateObj(key)) &&
    dateKey(dateObj(key)) === key
  );
}
