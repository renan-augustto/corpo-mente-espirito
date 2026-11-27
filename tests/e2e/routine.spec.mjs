import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const nav = (page, name) => page.getByRole('link', { name, exact: true });
const createTask = async (page, name) => {
  await page.getByRole('button', { name: 'Nova tarefa' }).click();
  await page.locator('#tn').fill(name);
  await page.getByRole('button', { name: 'Salvar tarefa' }).click();
};

test('onboarding, completion, journal, backup, ICS and offline', async ({ page, context }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/');
  await page.getByRole('button', { name: 'Criar minha rotina' }).click();
  await page.locator('#qn').fill('Teste');
  await page.getByRole('button', { name: 'Pré-visualizar plano' }).click();
  await page.getByRole('button', { name: 'Aplicar plano' }).click();
  await expect(page.getByRole('heading', { name: 'Olá, Teste' })).toBeVisible();
  await createTask(page, 'Tarefa fictícia');
  const checkbox = page.getByRole('checkbox', { name: 'Concluir Tarefa fictícia' });
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await page.reload();
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  await nav(page, 'Diário').click();
  await page.locator('#sleep').fill('7.5');
  await page.locator('#text').fill('Registro fictício');
  await page.getByRole('button', { name: 'Salvar registro' }).click();
  await nav(page, 'Evolução').click();
  await expect(page.getByText('7,5', { exact: true })).toBeVisible();
  await nav(page, 'Calendário').click();
  const [ics] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar 30 dias' }).click(),
  ]);
  expect(await readFile(await ics.path(), 'utf8')).toContain('BEGIN:VEVENT');
  await nav(page, 'Ajustes').click();
  const [backup] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar backup' }).click(),
  ]);
  const data = JSON.parse(await readFile(await backup.path(), 'utf8'));
  expect(data.profile.name).toBe('Teste');
  expect(Object.keys(data.journal)).toHaveLength(1);
  await page.getByRole('button', { name: 'Apagar todos os dados' }).click();
  await nav(page, 'Ajustes').click();
  await page.locator('#import').setInputFiles(await backup.path());
  await expect(page.getByRole('heading', { name: 'Olá, Teste' })).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Olá, Teste' })).toBeVisible();
  await context.setOffline(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('same-day completed task keeps its historical name after editing', async ({ page }) => {
  await page.goto('/');
  await nav(page, 'Rotina').click();
  await createTask(page, 'Histórico fictício');
  await page.getByRole('checkbox', { name: 'Concluir Histórico fictício' }).check();
  await page.getByRole('button', { name: 'Editar Histórico fictício' }).first().click();
  await page.locator('#tn').fill('Novo nome fictício');
  await page.getByRole('button', { name: 'Salvar tarefa' }).click();
  await expect(page.getByRole('checkbox', { name: 'Concluir Histórico fictício' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Concluir Novo nome fictício' })).toHaveCount(0);
  await page.locator('[data-action="next-day"]').click();
  await expect(page.getByRole('checkbox', { name: 'Concluir Novo nome fictício' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Concluir Histórico fictício' })).toHaveCount(0);
});

test('unreadable local data is not silently replaced', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cme-v1', '{invalid');
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Não foi possível abrir seus dados' }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('cme-v1'))).toBe('{invalid');
  const [backup] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar cópia original' }).click(),
  ]);
  expect(await readFile(await backup.path(), 'utf8')).toBe('{invalid');
});

test('journal opens today after browsing future routine and calendar dates', async ({ page }) => {
  await page.goto('/');
  await nav(page, 'Rotina').click();
  const date = page.locator('#selected-date');
  const current = await date.inputValue();
  await page.getByRole('button', { name: 'Próximo dia' }).click();
  const future = await date.inputValue();
  expect(future > current).toBe(true);
  await nav(page, 'Diário').click();
  await expect(date).toHaveValue(current);
  await expect(date).toHaveAttribute('max', current);
  await expect(page.getByRole('button', { name: 'Próximo dia' })).toBeDisabled();
  await page.locator('#sleep').fill('7.5');
  await page.locator('#text').fill('Registro de hoje');
  await page.getByRole('button', { name: 'Salvar registro' }).click();
  await page.getByRole('button', { name: 'Dia anterior' }).click();
  const previous = await date.inputValue();
  expect(previous < current).toBe(true);
  await page.locator('#sleep').fill('6');
  await page.locator('#text').fill('Registro anterior');
  await page.getByRole('button', { name: 'Salvar registro' }).click();
  await expect(date).toHaveValue(previous);
  await page.getByRole('button', { name: 'Próximo dia' }).click();
  await expect(page.locator('#text')).toHaveValue('Registro de hoje');
  await nav(page, 'Calendário').click();
  await expect(page.getByRole('heading', { name: 'Calendário', exact: true })).toBeVisible();
  const futureDay = page.locator(`[data-day="${future}"]`);
  if (!(await futureDay.count())) {
    await page.locator('[data-action="next-month"]').click();
  }
  await futureDay.click();
  await nav(page, 'Diário').click();
  await expect(date).toHaveValue(current);
  await date.fill(future);
  await expect(date).toHaveValue(current);
  await expect(page.locator('#text')).toHaveValue('Registro de hoje');
  await expect(page.getByRole('button', { name: 'Salvar registro' })).toBeEnabled();
});
