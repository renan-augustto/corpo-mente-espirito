import { all, work } from '../config/constants.mjs';
import { task } from './routine.mjs';
function addTime(t, n) {
  let [h, m] = t.split(':').map(Number),
    v = (h * 60 + m + n + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
}
export function planFrom(f) {
  let goals = f.getAll('goals'),
    wake = f.get('wake'),
    bed = f.get('bed'),
    budget = +f.get('available'),
    low = f.get('energy') === 'low',
    list = [],
    cursor = addTime(wake, 20);
  let add = (n, p, m, days = work, reserve = 0) => {
    let dur = Math.min(m, Math.max(0, budget - reserve));
    if (dur < 1) return;
    list.push(task(n, p, cursor, dur, days));
    cursor = addTime(cursor, dur + 5);
    budget -= dur;
  };
  if (goals.includes('job'))
    add('Buscar vagas e contatar recrutadores', 'mind', low ? 15 : 30, work, 10);
  else if (goals.includes('study')) add('Estudo direcionado', 'mind', low ? 5 : 25, work, 10);
  else if (goals.includes('finance'))
    add('Revisar gastos e próximos vencimentos', 'mind', 10, [1], 10);
  else add('Definir uma prioridade do dia', 'mind', 3, all, 10);
  add(
    goals.includes('exercise') ? 'Caminhada ou movimento leve' : 'Movimento leve',
    'body',
    low ? 5 : 15,
    all,
    5,
  );
  add(goals.includes('read') ? 'Leitura e reflexão' : 'Reflexão breve', 'spirit', 5, all);
  if (goals.includes('job') && goals.includes('study'))
    add('Estudo direcionado', 'mind', low ? 5 : 25);
  if (goals.includes('finance') && !list.some((t) => t.name.startsWith('Revisar gastos')))
    add('Revisar gastos e próximos vencimentos', 'mind', 10, [1]);
  if (goals.includes('social'))
    add('Conversar ou combinar atividade com alguém', 'spirit', 10, [3, 6]);
  if (goals.includes('project')) add('Projeto pessoal sem pressão', 'mind', 15, [6]);
  list.push(task('Preparar descanso e desacelerar', 'body', addTime(bed, -5), 5, all));
  return { name: f.get('name').trim(), list };
}
