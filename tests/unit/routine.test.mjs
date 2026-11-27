import { describe, it, expect } from 'vitest';
import { all } from '../../src/config/constants.mjs';
import { today, shift, validDate } from '../../src/utils/dates.mjs';
import {
  fresh,
  task,
  due,
  stat,
  retire,
  replaceTask,
  replacePlan,
  isActive,
  validate,
  validTask,
  phase,
} from '../../src/models/routine.mjs';
import { planFrom } from '../../src/models/plan.mjs';
import { loadState, persistState } from '../../src/services/storage.mjs';
import { buildCalendar, fold, icsEscape } from '../../src/services/calendar.mjs';
import { esc } from '../../src/views/html.mjs';

const day = '2026-11-27';
const yesterday = shift(day, -1);
const tomorrow = shift(day, 1);
const fixture = () => ({ ...fresh(), start: yesterday });

describe('routine history and schema v1', () => {
  it('counts completion and recurrence by civil date', () => {
    const s = fixture();
    const t = task('Fictícia', 'body', '09:00', 15, [5], yesterday);
    s.tasks.push(t);
    s.done[day] = [t.id];
    expect(stat(s, yesterday)).toEqual({ n: 0, d: 0 });
    expect(stat(s, day)).toEqual({ n: 1, d: 1 });
    expect(stat(s, tomorrow)).toEqual({ n: 0, d: 0 });
    expect(validDate('2026-02-30')).toBe(false);
    expect(validTask({ ...t, time: '25:00' })).toBe(false);
  });

  it('rejects coerced non-string task time and pillar in backups', () => {
    const s = fixture();
    const t = task('Fictícia', 'body', '09:00', 15, all, day);
    s.tasks.push({ ...t, time: ['09:00'] });
    expect(() => validate(s)).toThrow();
    s.tasks = [{ ...t, pillar: ['body'] }];
    expect(() => validate(s)).toThrow();
  });

  it('preserves original completed occurrence when editing', () => {
    const s = fixture();
    const t = task('Antes', 'body', '09:00', 10, all, yesterday);
    s.tasks.push(t);
    s.done[yesterday] = [t.id];
    s.done[day] = [t.id];
    replaceTask(s, t, task('Depois', 'mind', '10:00', 20, all, day), day);
    expect(stat(s, yesterday)).toEqual({ n: 1, d: 1 });
    expect(stat(s, day, 'body')).toEqual({ n: 1, d: 1 });
    expect(due(s, day)[0].name).toBe('Antes');
    expect(due(s, tomorrow)[0].name).toBe('Depois');
    expect(stat(s, tomorrow)).toEqual({ n: 1, d: 0 });
    expect(isActive(t, day)).toBe(false);
  });

  it('retires completed and pending tasks without losing history', () => {
    const s = fixture();
    const t = task('Concluída', 'mind', '09:00', 10, all, day);
    const p = task('Pendente', 'body', '10:00', 10, all, day);
    s.tasks.push(t, p);
    s.done[day] = [t.id];
    retire(s, t, day);
    retire(s, p, day);
    expect(stat(s, day)).toEqual({ n: 1, d: 1 });
    expect(due(s, tomorrow)).toEqual([]);
    expect(validate(s).version).toBe(1);
  });

  it('replans tomorrow only if today has completed tasks', () => {
    const s = fixture();
    const t = task('Concluída', 'mind', '09:00', 10, all, day);
    s.tasks.push(t);
    s.done[day] = [t.id];
    const plan = { name: 'Teste', list: [task('Novo plano', 'body', '10:00', 10, all, day)] };
    replacePlan(s, plan, day);
    expect(stat(s, day)).toEqual({ n: 1, d: 1 });
    expect(due(s, tomorrow).map((t) => t.name)).toEqual(['Novo plano']);
    const empty = fixture();
    replacePlan(empty, plan, day);
    expect(due(empty, day).map((t) => t.name)).toEqual(['Novo plano']);
  });

  it('round-trips the stable local storage key and rejects invalid backup', () => {
    const s = fixture();
    const data = new Map();
    const storage = { getItem: (k) => data.get(k), setItem: (k, v) => data.set(k, v) };
    persistState(storage, s);
    expect(data.has('cme-v1')).toBe(true);
    expect(loadState(storage)).toEqual(s);
    expect(() => validate({ ...s, version: 2 })).toThrow();
    expect(phase(s, day).title).toBe('Fundação');
  });
});

describe('planning and presentation', () => {
  it('preserves pillars and budget with five extra minutes for sleep', () => {
    const f = new FormData();
    for (const [k, v] of Object.entries({
      name: 'Teste',
      wake: '08:00',
      bed: '22:00',
      available: '20',
      energy: 'low',
    }))
      f.set(k, v);
    for (const g of ['job', 'study', 'exercise', 'read']) f.append('goals', g);
    const plan = planFrom(f);
    expect([...new Set(plan.list.map((t) => t.pillar))]).toEqual(['mind', 'body', 'spirit']);
    expect(plan.list.reduce((n, t) => n + t.minutes, 0)).toBeLessThanOrEqual(25);
  });

  it('escapes user text and creates calendar events with alarms', () => {
    const s = fresh();
    s.tasks.push(task('Fictícia, teste', 'body', '09:00', 10, all, today()));
    expect(esc('<script>')).toBe('&lt;script&gt;');
    expect(icsEscape('a,b')).toBe('a\\,b');
    expect(fold('A'.repeat(90))).toContain('\r\n ');
    const ics = buildCalendar(s);
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('END:VCALENDAR');
  });
});
