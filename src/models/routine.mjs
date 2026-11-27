import { pillars, all } from '../config/constants.mjs';
import { today, dateObj, uid, hh, validDate } from '../utils/dates.mjs';

// Version 1 persistence contract: do not change without an explicit migration.
export function fresh() {
  return { version: 1, profile: null, start: today(), tasks: [], done: {}, journal: {}, reminders: false, notified: {} };
}

export function validTask(t) {
  return t && typeof t.id === 'string' && t.id.length < 100
    && typeof t.name === 'string' && t.name.trim() && t.name.length <= 150
    && Object.hasOwn(pillars, t.pillar) && hh.test(t.time)
    && Number.isInteger(t.minutes) && t.minutes >= 1 && t.minutes <= 720
    && Array.isArray(t.days) && t.days.length > 0
    && t.days.every(d => Number.isInteger(d) && d >= 0 && d <= 6)
    && validDate(t.start) && (!t.end || validDate(t.end) && t.end >= t.start);
}

export function validate(s) {
  if (!s || s.version !== 1 || !validDate(s.start)
    || !Array.isArray(s.tasks) || s.tasks.length > 2000
    || !s.tasks.every(validTask) || new Set(s.tasks.map(t => t.id)).size !== s.tasks.length
    || !s.done || typeof s.done !== 'object' || Array.isArray(s.done)
    || !s.journal || typeof s.journal !== 'object' || Array.isArray(s.journal)
    || !Object.entries(s.done).every(([k, v]) => validDate(k) && Array.isArray(v) && v.every(x => typeof x === 'string'))
    || !Object.entries(s.journal).every(([k, v]) => validDate(k) && v && typeof v === 'object'
      && ['energy', 'mood', 'focus'].every(x => Number.isFinite(v[x]) && v[x] >= 0 && v[x] <= 10)
      && Number.isFinite(v.sleep) && v.sleep >= 0 && v.sleep <= 24
      && ['text', 'next'].every(x => typeof v[x] === 'string' && v[x].length <= 10000))
    || !(s.profile === null || s.profile && typeof s.profile.name === 'string' && s.profile.name.length <= 60)) {
    throw Error('Arquivo incompatível ou inválido.');
  }
  return { ...s, reminders: !!s.reminders, notified: {} };
}

export function task(name, pillar, time, minutes, days = all, start = today()) {
  return { id: uid(), name, pillar, time, minutes, days: [...days], start, end: null, reminder: true };
}

export function due(state, key) {
  const weekday = dateObj(key).getDay();
  return state.tasks
    .filter(t => t.start <= key && (!t.end || key <= t.end) && t.days.includes(weekday))
    .sort((a, b) => a.time.localeCompare(b.time) || a.name.localeCompare(b.name));
}

export function isDone(state, task, key) {
  return (state.done[key] || []).includes(task.id);
}

export function stat(state, key, pillar) {
  const tasks = due(state, key).filter(t => !pillar || t.pillar === pillar);
  return { n: tasks.length, d: tasks.filter(t => isDone(state, t, key)).length };
}

export const percentage = stat => stat.n ? Math.round(100 * stat.d / stat.n) : 0;
