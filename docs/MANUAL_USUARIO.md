# Manual do usuário — Corpo, Mente & Espírito
**Versão documentada: 1.0 (baseline de produção).** Manual em revisão na PR da v1.0.1. Recursos futuros não estão disponíveis até serem implementados, homologados e publicados.

## 1. Acesso e instalação
- Web: https://renan-augustto.github.io/corpo-mente-espirito/
- Android: abra o endereço no Chrome, menu ⋮, escolha Instalar aplicativo ou Adicionar à tela inicial conforme disponível. Também há a opção Instalar aplicativo em Ajustes.
- iOS: abra no Safari, Compartilhar > Adicionar à Tela de Início. A disponibilidade depende da versão do navegador/sistema.
- Computador: abra no navegador; se oferecida, use a instalação PWA.
- A v1.0 é PWA, não APK nem app nativo da App Store. Não baixe pacotes de origem desconhecida. O ambiente de testes terá endereço separado quando disponibilizado.

## 2. Primeira utilização
1. Em Início, selecione Criar minha rotina.
2. Informe horários, disponibilidade, energia e prioridades; respostas são opcionais conforme formulário.
3. Revise a sugestão e selecione Aplicar plano. O algoritmo usa regras locais, não interpreta texto livre com IA; ajuste tarefas inadequadas.
4. Se preferir, selecione Começar do zero e crie tarefas manualmente.
5. Para rever o questionário, use Ajustes > Responder questionário. Replanejar altera a rotina vigente; exporte backup antes. A v1.0 tem limitação conhecida no histórico do próprio dia ao editar/encerrar/replanejar, a corrigir em #1.

## 3. Rotina, calendário e evolução
| Tela | Como utilizar |
|---|---|
| Início | Veja o resumo diário, fases da jornada e progresso por Corpo, Mente e Espírito. |
| Rotina | Nova tarefa: nome, pilar, horário, duração, dias e lembrete. Escolha uma data; marque ou desmarque a conclusão. Edite/encerre conforme controles disponíveis. |
| Calendário | Navegue pelos meses e dias; exporte os próximos 30 dias em ICS. Importe no calendário escolhido. Reimportar pode duplicar eventos; remova os anteriores conforme necessário. |
| Diário | Escolha o dia, registre sono, energia, humor, concentração, reflexão e próxima ação; salve. |
| Evolução | Consulte contagens e médias autorrelatadas; os números não são diagnóstico nem avaliação de valor pessoal. |
| Ajustes | Questionário, nome, lembretes, instalação, importação/exportação e exclusão local. |

## 4. Dados e backups
Os dados v1.0 ficam no armazenamento local do navegador, sem conta ou sincronização. Não há criptografia pelo app. Evite dispositivos compartilhados; apagar dados do navegador, desinstalar ou mudar de origem pode perder acesso aos registros.
- Ajustes > Exportar backup: guarde o JSON em local protegido. Não publique arquivos pessoais no GitHub.
- Em Ajustes, selecione o arquivo JSON para importar. Um backup completo substitui os dados locais; exporte o atual antes de importar. Um modelo de rotina tem finalidade diferente de um backup completo: revise o plano e os efeitos da importação.
- Ajustes > Apagar todos os dados: ação destrutiva. Exporte backup primeiro se desejar conservar registros.
- Backup não equivale a sincronização automática. Para migrar de endereço/dispositivo, exporte na origem antiga e importe na nova; confirme os dados antes de apagar a origem.
- Depois de abrir online com sucesso, a PWA pode funcionar offline; armazenamento e cache dependem do navegador.

## 5. Lembretes e limitações
Em Ajustes > Permitir notificações, conceda permissão no navegador. A v1.0 verifica lembretes apenas enquanto a página executa; app fechado, abas suspensas, economia de bateria ou permissão negada podem impedir notificações. Use ICS com alarmes no calendário do sistema quando necessário. Notificações nativas pertencem à #2.
O aplicativo é uma ferramenta de organização pessoal, não assistência médica, psicológica, financeira ou garantia de resultado.

## 6. Solução de problemas
- Erro 404: confirme endereço publicado; se persistir, informe a versão/URL ao suporte.
- Dados ausentes: confirme navegador, perfil e origem corretos; procure seu backup antes de limpar armazenamento.
- Lembrete ausente: confira horário, permissão e limitações acima.
- Nova versão: preserve backup, reabra online e confira a versão fornecida na nota de release.
- Reporte erros sem expor seu diário, arquivos, e-mail, chaves ou outras informações privadas. Em repositório público use dados fictícios.

## 7. Funcionalidades futuras (não disponíveis na v1.0)
| Versão | Seção que será adicionada ao manual após homologação |
|---|---|
| 1.1 | APK/iOS, permissões e notificações nativas |
| 1.2 | Migração e armazenamento local seguro |
| 1.3 | Modos Manual e Guiado |
| 1.4 | Cadastro Google/Apple opcional e exclusão |
| 1.5 | Backup pessoal criptografado, Drive/iCloud conforme suporte |
| 1.6 | Conselheiro IA, configuração BYOK, custos/consentimento e revisão de plano |
| 1.7 | Beta gratuito, licenças, restauração de compra e política offline |
| 1.8 | Biblioteca, projetos e calendários |
| 1.9–2.0 | Segurança, privacidade e lançamento comercial autorizado |
| 2.1 | Indicações e recompensas, após validação legal |
| 3.0 | Subtarefas, fichas de treino, estudo por PDF, simulados e IA avançada opcional |
Consulte [roadmap](ROADMAP.md). A versão publicada, não este planejamento, determina recursos disponíveis. Preços e provedores futuros estão sujeitos à aprovação.
