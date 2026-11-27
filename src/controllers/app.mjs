import { dateObj, today, shift, uid, validDate } from '../utils/dates.mjs';
import {
  fresh,
  validTask,
  validate,
  task,
  isActive,
  retire as modelRetire,
  replaceTask as modelReplaceTask,
  replacePlan,
} from '../models/routine.mjs';
import { loadState, persistState } from '../services/storage.mjs';
import { buildCalendar } from '../services/calendar.mjs';
import { remind as notifyDue } from '../services/reminders.mjs';
import { planFrom } from '../models/plan.mjs';
import { createViews } from '../views/screens.mjs';
import { esc, ico } from '../views/html.mjs';

// The controller owns state, routing, browser events and side effects.
export function startApp() {
  const $ = (selector) => document.querySelector(selector);
  let state;
  try {
    state = loadState(localStorage);
  } catch (e) {
    state = fresh();
    console.warn(e);
  }
  let selected = today(),
    month = dateObj(selected),
    route = 'inicio',
    installPrompt,
    toastTimer;
  const navs = [
    ['inicio', 'home', 'Início'],
    ['rotina', 'tasks', 'Rotina'],
    ['calendario', 'calendar', 'Calendário'],
    ['diario', 'book', 'Diário'],
    ['evolucao', 'chart', 'Evolução'],
    ['ajustes', 'settings', 'Ajustes'],
  ];
  function save() {
    try {
      persistState(localStorage, state);
      return true;
    } catch (e) {
      toast('Não foi possível salvar. Exporte seus dados em Ajustes.');
      return false;
    }
  }
  function toast(s) {
    $('#toast').textContent = s;
    $('#toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4500);
  }
  const views = createViews({
    getState: () => state,
    getSelected: () => selected,
    getMonth: () => month,
  });
  function render() {
    route = location.hash.slice(1) || 'inicio';
    if (!navs.some((n) => n[0] === route)) route = 'inicio';
    $('#nav').innerHTML = navs
      .map(
        ([r, i, l]) =>
          `<a href="#${r}" ${r === route ? 'aria-current="page"' : ''}>${ico(i)}${l}</a>`,
      )
      .join('');
    $('#main').innerHTML = {
      inicio: views.dashboard,
      rotina: views.routine,
      calendario: views.calendar,
      diario: views.journal,
      evolucao: views.evolution,
      ajustes: views.settings,
    }[route]();
  }
  function dialog(content) {
    let d = $('#dialog');
    d.innerHTML = `<div class="dialog-header row spread"><h2 id="dialog-title">${content.title}</h2><button type="button" class="icon-btn" data-action="close" aria-label="Fechar">${ico('close')}</button></div><div class="dialog-content">${content.body}</div><div class="dialog-footer row"></div>`;
    d.setAttribute('aria-labelledby', 'dialog-title');
    const body = d.querySelector('.dialog-content');
    const footer = d.querySelector('.dialog-footer');
    const form = body.querySelector('form[id]');
    const submit = form?.querySelector('button[type="submit"]');
    if (submit) {
      submit.setAttribute('form', form.id);
      footer.append(submit);
    } else {
      const actions = body.querySelector('[data-action="apply-plan"]')?.parentElement;
      if (actions) footer.append(...actions.children);
    }
    footer.hidden = !footer.children.length;
    if (!d.open) d.showModal();
    body.scrollTop = 0;
  }
  function taskDialog(id) {
    dialog(views.taskDialog(id));
  }
  function question() {
    dialog(views.question());
  }
  let pendingPlan = null;
  function preview(f) {
    pendingPlan = planFrom(f);
    dialog(views.preview(pendingPlan));
  }
  function retire(t) {
    modelRetire(state, t);
  }
  function replaceTask(old, next) {
    modelReplaceTask(state, old, next);
  }
  function download(name, text, mime) {
    let url = URL.createObjectURL(new Blob([text], { type: mime })),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function ics() {
    download('rotina-30-dias.ics', buildCalendar(state), 'text/calendar;charset=utf-8');
    toast('Calendário exportado. Importe no aplicativo de calendário.');
  }
  function remind() {
    notifyDue(state, toast, save);
  }
  function go(r) {
    if (location.hash === '#' + r) render();
    else location.hash = r;
  }
  async function action(a) {
    switch (a) {
      case 'new':
        taskDialog();
        break;
      case 'close':
        $('#dialog').close();
        break;
      case 'question':
        question();
        break;
      case 'blank':
        state.profile = { name: '' };
        save();
        render();
        break;
      case 'apply-plan':
        if (!pendingPlan) break;
        if (
          state.tasks.some((t) => isActive(t)) &&
          !confirm(
            'Substituir as tarefas ativas pelo novo plano? O histórico será mantido; se já concluiu tarefas hoje, o novo plano começa amanhã.',
          )
        )
          break;
        replacePlan(state, pendingPlan);
        pendingPlan = null;
        save();
        $('#dialog').close();
        go('inicio');
        toast('Seu plano está pronto.');
        break;
      case 'prev-day':
        selected = shift(selected, -1);
        render();
        break;
      case 'next-day':
        selected = shift(selected, 1);
        render();
        break;
      case 'today':
        selected = today();
        month = dateObj(selected);
        render();
        break;
      case 'prev-month':
        month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
        render();
        break;
      case 'next-month':
        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        render();
        break;
      case 'open-journal':
        selected = today();
        go('diario');
        break;
      case 'ics':
        ics();
        break;
      case 'backup':
        download('tres-pilares-backup.json', JSON.stringify(state, null, 2), 'application/json');
        break;
      case 'import':
        $('#import').click();
        break;
      case 'reset':
        if (
          confirm(
            'Apagar todas as tarefas, diário e histórico deste dispositivo? Exporte um backup antes.',
          )
        ) {
          state = fresh();
          save();
          go('inicio');
          toast('Dados apagados.');
        }
        break;
      case 'profile':
        dialog({
          title: 'Seu perfil',
          body: `<form id="profile-form"><div class="field"><label for="pn">Nome (opcional)</label><input id="pn" name="name" maxlength="60" value="${esc(state.profile?.name || '')}"></div><button class="primary" type="submit">Salvar</button></form>`,
        });
        break;
      case 'permission':
        if (!('Notification' in window)) {
          toast('Este navegador não oferece notificações web. Use o calendário.');
          break;
        }
        try {
          let p = await Notification.requestPermission();
          toast(
            p === 'granted'
              ? 'Permissão concedida. Ative os lembretes no aplicativo.'
              : 'Permissão não concedida. Lembretes internos continuam disponíveis.',
          );
        } catch (e) {
          toast('Não foi possível pedir permissão. Use o calendário.');
        }
        break;
      case 'install':
        if (installPrompt) {
          await installPrompt.prompt();
          installPrompt = null;
        } else toast('Use o menu do navegador: Instalar aplicativo ou Adicionar à Tela de Início.');
        break;
    }
  }
  document.addEventListener('click', (e) => {
    let b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.action) {
      action(b.dataset.action).catch((err) => {
        console.error(err);
        toast('Não foi possível completar esta ação.');
      });
      return;
    }
    if (b.dataset.edit) {
      taskDialog(b.dataset.edit);
      return;
    }
    if (b.dataset.delete) {
      let t = state.tasks.find((x) => x.id === b.dataset.delete);
      if (
        t &&
        confirm('Encerrar esta tarefa a partir de hoje? Os dias anteriores serão mantidos.')
      ) {
        retire(t);
        save();
        render();
        toast('Tarefa encerrada.');
      }
      return;
    }
    if (b.dataset.day) {
      selected = b.dataset.day;
      render();
      return;
    }
    if (b.dataset.journal) {
      selected = b.dataset.journal;
      render();
    }
  });
  document.addEventListener('change', async (e) => {
    let el = e.target;
    if (el.dataset.toggle) {
      let k = el.dataset.date,
        id = el.dataset.toggle;
      if (k > today()) return;
      let s = new Set(state.done[k] || []);
      if (el.checked) s.add(id);
      else s.delete(id);
      state.done[k] = [...s];
      save();
      render();
    } else if (el.id === 'selected-date' && validDate(el.value)) {
      selected = el.value;
      render();
    } else if (el.id === 'reminders') {
      state.reminders = el.checked;
      save();
      if (el.checked) remind();
      toast(el.checked ? 'Lembretes internos ativados.' : 'Lembretes desativados.');
    } else if (el.id === 'import' && el.files[0]) {
      try {
        if (el.files[0].size > 10000000) throw Error('Arquivo muito grande (máximo 10 MB).');
        let raw = JSON.parse(await el.files[0].text());
        if (raw.type === 'cme-routine-template') {
          let base = fresh();
          base.profile = { name: '' };
          if (!Array.isArray(raw.tasks)) throw Error('Modelo inválido.');
          base.tasks = raw.tasks.map((t) => ({ ...t, id: uid(), start: today(), end: null }));
          raw = base;
        }
        let s = validate(raw);
        if (confirm('Substituir os dados locais pelo arquivo importado?')) {
          state = s;
          save();
          selected = today();
          month = dateObj(selected);
          go('inicio');
          toast('Backup importado.');
        }
      } catch (err) {
        toast(err.message || 'Não foi possível importar.');
      } finally {
        el.value = '';
      }
    }
  });
  document.addEventListener('input', (e) => {
    let k = e.target.dataset.range;
    if (k && $('#' + k + '-out')) $('#' + k + '-out').textContent = e.target.value;
  });
  document.addEventListener('submit', (e) => {
    let form = e.target;
    if (!['task-form', 'question-form', 'journal-form', 'profile-form'].includes(form.id)) return;
    e.preventDefault();
    let f = new FormData(form);
    if (form.id === 'question-form') {
      preview(f);
      return;
    }
    if (form.id === 'task-form') {
      let t = task(
        f.get('name').trim(),
        f.get('pillar'),
        f.get('time'),
        Number(f.get('minutes')),
        f.getAll('days').map(Number),
      );
      t.reminder = f.has('reminder');
      if (!validTask(t)) {
        toast('Preencha o nome, horário, duração e pelo menos um dia.');
        return;
      }
      let old = state.tasks.find((x) => x.id === form.dataset.id);
      replaceTask(old, t);
      save();
      $('#dialog').close();
      render();
      toast('Tarefa salva.');
    } else if (form.id === 'journal-form') {
      if (selected > today()) return;
      state.journal[selected] = {
        sleep: +f.get('sleep'),
        energy: +f.get('energy'),
        mood: +f.get('mood'),
        focus: +f.get('focus'),
        text: f.get('text'),
        next: f.get('next'),
      };
      save();
      render();
      toast('Registro salvo.');
    } else {
      state.profile = { name: f.get('name').trim() };
      save();
      $('#dialog').close();
      render();
      toast('Perfil salvo.');
    }
  });
  window.addEventListener('hashchange', () => {
    render();
    $('#main').focus();
  });
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
  });
  window.addEventListener('appinstalled', () => toast('Aplicativo instalado.'));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) remind();
  });
  render();
  setInterval(remind, 15000);
  remind();
  if ('serviceWorker' in navigator && location.protocol !== 'file:')
    navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('Service worker:', e));
}
