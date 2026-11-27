# Roadmap oficial — Corpo, Mente & Espírito
Decisões consolidadas em 27/11/2026. As Issues são a fonte de trabalho e critérios de aceitação; este documento é o índice de escopo. Mudanças de escopo exigem aprovação do proprietário e atualização de ambos. Nenhum item planejado implica implementação concluída.

| Versão | Issues | Entrega |
|---|---|---|
| 1.0 | — | PWA inicial; sete cenários de aceitação manual aprovados |
| 1.0.1 | #1, #3 | Refatoração MVC e CI/CD, regressão e ambientes |
| 1.1 | #2 | Capacitor Android/iOS, notificações nativas |
| 1.2 | #8 | Armazenamento local seguro, migração |
| 1.3 | #9 | Manual e guiado offline |
| 1.4 | #5 | Login Google/Apple opcional, cadastro mínimo |
| 1.5 | #10 | Backup pessoal Drive/iCloud, sujeito a viabilidade |
| 1.6 | #7 | Conselheiro adaptativo BYOK, aprovação da rotina |
| 1.7 | #11, #12 | Cloudflare, licenças, beta gratuito e flags |
| 1.8 | #4, #6 | Biblioteca, filosofia, projetos, calendário |
| 1.9 | #13 | Auditoria final de segurança, privacidade e conformidade |
| 2.0 | #14 | Lançamento comercial aprovado |
| 2.1 | #15 | Indicações e recompensas |
| 3.0 | #16–#19 | Subtarefas extensíveis, treino, estudo por PDF e IA avançada |

## Requisitos permanentes
- Local-first, privacy-first, offline para funções essenciais, dados íntimos nunca persistidos no backend próprio; nenhum diário, rotina, questionário, treino, estudo, histórico, conversa ou chave de IA em logs comerciais. Cadastro comercial mínimo é dado pessoal e exige proteção.
- Manual e guiado gratuitos; PRO com compra única (R$ 10 indicativos, não preço definitivo); BYOK paga o provedor. PRO Advanced e créditos de IA gerenciada são hipóteses futuras, sem promessa de IA ilimitada. Processamento transitório próprio exige aprovação explícita antes de implementação.
- Login opcional; dados pessoais locais acessíveis/exportáveis mesmo sem licença, rede ou servidor. Backup pessoal opcional, criptografado, sem segredos. Consentimento e revisão de saídas IA; termos por provedor e elegibilidade etária antes do lançamento.
- Staging isolado (develop) e produção (main), credenciais/identificadores/bases distintos. Produção beta gratuita, recursos homologados liberados, cobrança e indicações desligadas por padrão. Nenhum deploy ativa cobrança. Somente autorização explícita, controle server-side, auditoria e rollback. Nunca cobrar retroativamente.
- Indicações: dez vendas diretas válidas para licença ou cashback limitado ao valor pago (referência R$ 10); uma recompensa por participante, sem níveis, cashback condicionado a parecer jurídico/fiscal e lojas.
- Android, iOS e Web, sem diagnósticos ou garantias de resultado. Segurança desde o início; mídia e documentos respeitam direitos autorais.

## Tecnologias e decisões
- ES modules JavaScript, MVC (models/views/controllers/services), modelos independentes de DOM, tipos de tarefa extensíveis; HTML/CSS atuais nesta fase.
- Vitest, Playwright, ESLint, Prettier, GitHub Actions; Appium fora do escopo inicial, validação nativa em aparelho real.
- Capacitor; SQLite mobile, IndexedDB web, JSON interoperável; Keystore/Keychain conforme integração e plataforma.
- Cloudflare Pages antecipado exclusivamente para hospedagem web e previews da #3; Workers e Supabase Auth/PostgreSQL comercial permanecem nas fases posteriores; Google/Apple OAuth, Drive appDataFolder/iCloud conforme viabilidade.
- Gemini/OpenAI/Claude e outros por adaptadores, BYOK sujeito a segurança e termos; não assumir que login Google concede acesso ao Gemini. Integrações precisam de homologação individual.
- GitHub Pages apenas validação não comercial enquanto infraestrutura comercial não estiver pronta.

## Escopo ativo: 1.0.1
Somente #1 e #3. Sem login, IA, pagamentos, migração SQLite, módulos novos ou alterações comerciais nesta entrega. Preservar schema v1, chave cme-v1 e exportação JSON. Corrigir histórico no dia de edição/encerramento/replanejamento com regressões explícitas; validar sete fluxos aceitos, calendário, offline e instalação. Promover apenas após testes e aprovação do proprietário. Não expor informações pessoais no repositório público.

## Governança de qualidade
Manual: [MANUAL_USUARIO.md](MANUAL_USUARIO.md). Processo: [QUALIDADE_E_HOMOLOGACAO.md](QUALIDADE_E_HOMOLOGACAO.md). Cada Issue possui DoD e responsabilidades do proprietário; UATs do sprint: #21 e #22. Não ampliam escopo funcional.

## Hospedagem web antecipada
[Configuração de hospedagem e homologação](HOSPEDAGEM.md): Cloudflare Pages conectado, primeiro deploy main informado pelo proprietário, preview e CI ainda a validar. GitHub Pages legado mantido durante a transição.
