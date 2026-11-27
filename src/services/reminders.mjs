import { pillars } from '../config/constants.mjs';
import { today } from '../utils/dates.mjs';
import { due, isDone } from '../models/routine.mjs';

// Browser reminders are only evaluated while the application is running.
export function remind(state, toast, save) {
  if (!state.reminders) return;
  let now = new Date(),
    k = today(),
    timen = now.getHours() * 60 + now.getMinutes();
  for (let t of due(state, k)) {
    let [h, m] = t.time.split(':').map(Number),
      id = k + '-' + t.id;
    if (
      !t.reminder ||
      isDone(state, t, k) ||
      state.notified[id] ||
      timen < h * 60 + m ||
      timen > h * 60 + m + 2
    )
      continue;
    state.notified[id] = true;
    toast('Lembrete: ' + t.name);
    if ('Notification' in window && Notification.permission === 'granted') {
      if (navigator.serviceWorker?.controller)
        navigator.serviceWorker.ready
          .then((r) =>
            r.showNotification(pillars[t.pillar], {
              body: t.name,
              tag: id,
              icon: './icons/icon-192.png',
            }),
          )
          .catch(() => {});
      else
        try {
          new Notification(pillars[t.pillar], { body: t.name, tag: id });
        } catch {
          // Notification failure must not interrupt local reminders.
        }
    }
  }
  for (let id of Object.keys(state.notified)) if (!id.startsWith(k)) delete state.notified[id];
  save();
}
