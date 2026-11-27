# Corpo, Mente & Espírito

Planejamento e decisões de arquitetura: [roadmap oficial](docs/ROADMAP.md). Orientações de desenvolvimento: [AGENTS.md](AGENTS.md).

Aplicativo pessoal de rotina, hábitos e reflexão. PWA estática, em português, sem dependências externas, sem conta e sem servidor de dados.

## Publicar no GitHub Pages (sem programação)

1. Crie um repositório público no GitHub, por exemplo `corpo-mente-espirito`.
2. Extraia o ZIP e envie os arquivos **dentro** da pasta para a raiz do repositório (o `index.html` deve estar na raiz). Faça commit na branch `main`.
3. No repositório, abra **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Selecione `main` e `/ (root)`; clique Save.
4. Abra o link informado pelo GitHub Pages, normalmente `https://SEU-USUARIO.github.io/corpo-mente-espirito/`. O link pode ser compartilhado.
5. No celular, use a opção de instalar aplicativo/adicionar à tela inicial do navegador. Em iOS, use Safari → Compartilhar → Adicionar à Tela de Início.

Não publique backups pessoais no repositório. O código público não contém dados pessoais. Cada usuário configura sua própria rotina e possui armazenamento isolado por navegador e origem. Repositórios públicos são a opção gratuita usual do Pages; a disponibilidade depende do plano e das configurações do GitHub.

## Uso local

Abra um terminal na pasta e execute `python3 -m http.server 8000`, depois visite `http://localhost:8000`. Não abra apenas o arquivo HTML se quiser testar instalação/offline, que exigem HTTPS ou localhost. Não é necessário instalar pacotes. O usuário final acessa apenas a URL publicada.

## Funcionalidades v1.0

- Painel com os três pilares e indicadores derivados das tarefas efetivamente registradas.
- Questionário opcional com prioridades, energia autorrelatada, tempo disponível, horário de acordar/dormir; prévia de plano gerado por regras, sem IA e sem diagnóstico. Texto de contexto livre não é interpretado nem armazenado.
- Criação, edição, encerramento, dias da semana, duração, horário, conclusão diária e ícones por pilar. Edições preservam dias anteriores; o dia atual é recalculado.
- Calendário mensal e exportação ICS dos próximos 30 dias (com alarme de cinco minutos para tarefas com lembrete). Exportações repetidas podem gerar duplicatas em certos calendários; remova eventos antigos antes de reimportar, se necessário.
- Diário diário: sono, energia, humor, concentração, reflexão e próxima ação. Evolução semanal por contagem de tarefas e médias autorrelatadas. Nenhum escore clínico.
- Jornada de 90 dias com fases orientativas; não aumenta carga automaticamente.
- Lembretes locais, PWA offline após primeira visita bem-sucedida, exportação/importação JSON e exclusão dos dados.

## Limites e privacidade

- Notificações locais são verificadas a cada 15 segundos enquanto a página executa, somente até dois minutos após o horário. Abas suspensas, falta de permissão e aplicativo fechado podem impedir avisos. Não há serviço de push, agendamento de sistema operacional nem sincronização direta com Google Calendar. Importe o ICS em seu calendário para aproveitar os alarmes do próprio sistema, conforme suporte e permissões.
- Não há login, nuvem, compartilhamento de registros, sincronização entre dispositivos, IA ou integração médica. localStorage não é criptografado pelo app. Dados podem ser apagados pelo navegador. Exporte backups regularmente e guarde-os em local protegido. Importação substitui o estado atual.
- O plano é uma sugestão; compromissos específicos, horários de trabalho, contraindicações, alimentação e necessidades de sono precisam de revisão manual. Não substitui assistência profissional. Em caso de cansaço persistente ou sofrimento emocional, procure atendimento de saúde.
- Indicadores não avaliam o valor pessoal, saúde ou felicidade. Dias sem tarefas não entram no denominador semanal.

## Teste manual

1. Responda ao questionário, aplique o plano e confira os ícones, horários e pilares.
2. Conclua tarefa, recarregue a página e verifique persistência. Edite/encerre uma tarefa e veja o calendário.
3. Registre diário, confira evolução, exporte backup e importe-o novamente.
4. Exporte ICS e confira eventos no calendário escolhido. Teste permissões e instalação em cada dispositivo alvo.
5. Após abrir online, desligue a rede e recarregue; os recursos locais devem continuar disponíveis.

## Manutenção

Arquivos: `index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icons/`. Ao atualizar, altere a versão de `CACHE` em `sw.js`. Nenhuma etapa de build é necessária. Não inclua dados privados ou backups em commits.

## Testes automatizados

`node tests/logic.cjs` testa recorrência, conclusão, preservação de histórico, geração de plano, validação e utilitários. Para o teste de navegador, instale Playwright Python e Chromium e execute `python tests/smoke.py` (opcionalmente defina `CHROMIUM_PATH`). O ambiente original bloqueou a navegação local por política administrativa, então o teste de interface permanece pendente.

Importação de modelo de rotina: formato JSON `{ "type": "cme-routine-template", "tasks": [...] }`; datas são iniciadas no dia da importação. Não publique seus modelos privados.
