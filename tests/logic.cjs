// Run: node tests/logic.cjs. Pure module regression checks, no browser.
const assert = require('node:assert/strict');
async function main() {
  const constants = await import('../src/config/constants.mjs');
  const dates = await import('../src/utils/dates.mjs');
  const models = await import('../src/models/routine.mjs');
  const storage = await import('../src/services/storage.mjs');
  const { planFrom } = await import('../src/models/plan.mjs');
  const { esc } = await import('../src/views/html.mjs');
  const { fold, buildCalendar } = await import('../src/services/calendar.mjs');
  const baseline = models.fresh(),
    day0 = dates.today();
  const t = models.task('Teste', 'body', '10:00', 15);
  baseline.tasks.push(t);
  assert.deepEqual(models.stat(baseline, day0), { n: 1, d: 0 });
  baseline.done[day0] = [t.id];
  assert.deepEqual(models.stat(baseline, day0), { n: 1, d: 1 });
  const t2 = models.task('Histórico', 'mind', '11:00', 20, constants.all, dates.shift(day0, -2));
  baseline.tasks.push(t2);
  models.replaceTask(baseline, t2, models.task('Novo', 'mind', '12:00', 20));
  assert.deepEqual(
    models.due(baseline, dates.shift(day0, -1)).map((t) => t.name),
    ['Histórico'],
  );
  assert.deepEqual(
    models.due(baseline, day0).map((t) => t.name),
    ['Teste', 'Novo'],
  );
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
  assert.deepEqual([...new Set(plan.list.map((t) => t.pillar))], ['mind', 'body', 'spirit']);
  assert.ok(plan.list.reduce((n, t) => n + t.minutes, 0) <= 25);
  assert.equal(models.validTask({ ...t, time: '25:00' }), false);
  assert.equal(esc('<script>'), '&lt;script&gt;');
  assert.ok(fold('A'.repeat(90)).includes('\r\n '));
  assert.equal(models.phase(baseline).title, 'Fundação');
  assert.ok(buildCalendar(baseline).includes('BEGIN:VALARM'));
  console.log(
    'PASS: recurrence, completion, historical edits, onboarding budget, escaping, ICS, phases.',
  );
  // Direct tests for extracted model, including recurrence and independent dates.
  const state = models.fresh(),
    day = dates.today(),
    previous = dates.shift(day, -1);
  const recurring = models.task('Regression', 'body', '09:00', 10, constants.all, previous);
  state.tasks.push(recurring);
  state.done[previous] = [recurring.id];
  assert.deepEqual(models.stat(state, previous), { n: 1, d: 1 });
  assert.deepEqual(models.stat(state, day), { n: 1, d: 0 });
  assert.equal(models.validate(state).version, 1);
  assert.equal(dates.validDate('2026-02-30'), false);
  console.log('PASS: extracted model and date contracts.');

  // Explicit date fixtures for same-day history and storage.
  const d = '2026-11-27',
    y = dates.shift(d, -1),
    tomorrow = dates.shift(d, 1);
  const s = models.fresh();
  s.start = y;
  const old = models.task('Concluída', 'body', '08:00', 10, constants.all, y);
  s.tasks.push(old);
  s.done[y] = [old.id];
  s.done[d] = [old.id];
  models.replaceTask(s, old, models.task('Editada', 'mind', '09:00', 15, constants.all, d), d);
  assert.deepEqual(models.stat(s, y), { n: 1, d: 1 });
  assert.deepEqual(models.stat(s, d), { n: 1, d: 1 });
  assert.deepEqual(models.stat(s, tomorrow), { n: 1, d: 0 });
  assert.equal(models.due(s, d)[0].name, 'Concluída');
  assert.equal(models.due(s, tomorrow)[0].name, 'Editada');
  assert.equal(models.isActive(old, d), false);
  const same = models.task('Encerrar hoje', 'body', '10:00', 10, constants.all, d);
  s.tasks.push(same);
  s.done[d].push(same.id);
  models.retire(s, same, d);
  assert.equal(
    models.due(s, d).some((t) => t.id === same.id),
    true,
  );
  assert.equal(
    models.due(s, tomorrow).some((t) => t.id === same.id),
    false,
  );
  const pending = models.task('Pendente', 'body', '11:00', 10, constants.all, d);
  s.tasks.push(pending);
  models.retire(s, pending, d);
  assert.equal(
    s.tasks.some((t) => t.id === pending.id),
    false,
  );
  models.replacePlan(
    s,
    { name: 'Teste', list: [models.task('Novo plano', 'spirit', '12:00', 10, constants.all, d)] },
    d,
  );
  assert.deepEqual(models.stat(s, d), { n: 2, d: 2 });
  assert.equal(models.due(s, tomorrow).length, 1);
  assert.equal(models.due(s, tomorrow)[0].name, 'Novo plano');
  const clean = models.fresh();
  models.replacePlan(
    clean,
    { name: 'Teste', list: [models.task('Hoje', 'mind', '12:00', 10, constants.all, d)] },
    d,
  );
  assert.equal(models.due(clean, d).length, 1);
  let raw = null;
  const fake = {
    getItem: (k) => raw,
    setItem: (k, v) => {
      assert.equal(k, 'cme-v1');
      raw = v;
    },
  };
  storage.persistState(fake, s);
  assert.deepEqual(storage.loadState(fake), models.validate(s));
  assert.equal(models.validate(s).version, 1);
  console.log('PASS: same-day edit, retire, replan and local storage regression.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
