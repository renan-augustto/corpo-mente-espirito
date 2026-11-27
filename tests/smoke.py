"""Optional browser smoke test: pip install playwright; playwright install chromium."""
import json, os, subprocess, sys, time, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 time.sleep(.5)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or None,args=['--no-sandbox'])
  ctx=browser.new_context(accept_downloads=True,viewport={'width':1280,'height':900})
  page=ctx.new_page(); errors=[]; page.on('pageerror',lambda e:errors.append(str(e))); page.on('dialog',lambda d:d.accept())
  page.goto('http://127.0.0.1:8765/'); page.get_by_role('button',name='Criar minha rotina').click(); page.locator('#qn').fill('Teste');page.locator('#qa').select_option('90');page.get_by_role('button',name='Pré-visualizar plano').click();page.get_by_role('button',name='Aplicar plano').click();page.get_by_role('heading',name='Olá, Teste').wait_for()
  page.locator('[data-toggle]').first.check();page.reload();assert page.locator('[data-toggle]').first.is_checked()
  page.get_by_role('link',name='Rotina',exact=True).click();page.get_by_role('button',name='Nova tarefa').click();page.locator('#tn').fill('Tarefa extra');page.locator('#tp').select_option('spirit');page.get_by_role('button',name='Salvar tarefa').click();assert page.get_by_text('Tarefa extra',exact=True).count()==2
  page.locator('[data-edit]').last.click();page.locator('#tn').fill('Tarefa revisada');page.get_by_role('button',name='Salvar tarefa').click();assert page.get_by_text('Tarefa revisada',exact=True).count()==2
  page.get_by_role('link',name='Diário',exact=True).click();page.locator('#sleep').fill('7.5');page.locator('#text').fill('Registro de teste');page.get_by_role('button',name='Salvar registro').click();assert page.get_by_text('Registro de teste',exact=True).count()>=1
  page.get_by_role('link',name='Evolução',exact=True).click();assert page.get_by_text('7,5',exact=True).is_visible()
  page.get_by_role('link',name='Calendário',exact=True).click()
  with page.expect_download() as d: page.get_by_role('button',name='Exportar 30 dias').click()
  content=Path(d.value.path()).read_text();assert 'BEGIN:VEVENT' in content and 'BEGIN:VALARM' in content and 'END:VCALENDAR' in content
  page.get_by_role('link',name='Ajustes',exact=True).click()
  with page.expect_download() as d: page.get_by_role('button',name='Exportar backup').click()
  backup=Path(d.value.path());data=json.loads(backup.read_text());assert data['profile']['name']=='Teste' and data['journal']
  page.get_by_role('button',name='Apagar todos os dados').click();page.get_by_role('link',name='Ajustes',exact=True).click();page.locator('#import').set_input_files(str(backup));page.get_by_role('heading',name='Olá, Teste').wait_for()
  page.evaluate('navigator.serviceWorker.ready');page.wait_for_function('!!navigator.serviceWorker.controller');ctx.set_offline(True);page.reload();page.get_by_role('heading',name='Olá, Teste').wait_for();ctx.set_offline(False)
  page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth');assert not errors,errors
  print('PASS: onboarding, tasks, persistence, journal, evolution, ICS, backup, offline, mobile width; no uncaught JS errors.')
  browser.close()
finally: server.terminate();server.wait(timeout=5)
