# Processo de qualidade, DoD e homologação (UAT)
## Papéis
- Engenharia: implementar, revisar, preparar build de staging, dados fictícios, instruções, CI, testes unitários/integração/E2E e segurança, investigar falhas, atualizar manual e notas. Não transferir programação ou auditoria técnica ao proprietário.
- Proprietário: aprovar escopo, executar UAT no ambiente indicado, validar experiência, colaborar com testes em aparelho real e autorizar promoção/comercialização explicitamente. Contas administrativas, credenciais de lojas e decisões legais/comerciais somente quando necessárias; segredos por mecanismos seguros, nunca em Issues.
- Consultores competentes: validações jurídicas/fiscais quando exigidas; UAT não as substitui.

## Definition of Ready (DoR)
Issue vinculada ao roadmap com objetivo, escopo e exclusões, dependências, critérios de aceitação verificáveis e DoD. Identificar riscos de dados e compatibilidade. Antes de UAT: PR candidato, build/commit identificados, CI aprovado, staging isolado, fixtures fictícias, roteiro, limitações e forma de reportar falhas disponíveis.

## Definition of Done comum
- [ ] Critérios da Issue implementados e revisão técnica concluída em PR.
- [ ] Testes aplicáveis executados no commit candidato e evidências registradas. Testes não executados ou bloqueados explícitos; cenário obrigatório pendente impede conclusão salvo mudança de escopo aprovada e documentada.
- [ ] Regressão, dados locais, segurança, privacidade, acessibilidade, offline e compatibilidade avaliados conforme impacto.
- [ ] Falhas bloqueadoras corrigidas e retestadas; demais riscos aceitos/documentados.
- [ ] Manual, notas de versão e roadmap atualizados conforme alterações reais.
- [ ] UAT específica aprovada pelo proprietário, com resultados e versão registrada.
- [ ] Aprovação explícita de promoção quando aplicável; smoke pós-deploy ou rollback documentado na Issue de release. Não confundir aprovação UAT com autorização comercial.

## Fluxo por Issue
1. Engenharia prepara critérios e DoD da Issue de desenvolvimento.
2. Quando entrar em execução, criar Issue [UAT] atribuída ao proprietário, referenciando a Issue principal; adicionar referência recíproca. Se sub-issues nativas estiverem disponíveis, vincular também na hierarquia. Não criar tarefas prematuras para todo o roadmap.
3. Disponibilizar build de staging e dados fictícios; somente então solicitar teste. O status inicial é bloqueado enquanto faltar build/CI.
4. Proprietário registra PASS, FAIL, BLOCKED ou N/A (com justificativa aprovada). Engenharia corrige falhas, fornece nova build e solicita reteste. Não encerrar Issue pai com UAT obrigatória pendente.
5. Registrar aceite explícito, fechar UAT e seguir gate de publicação. Não fazer merge ou deploy sem autorização definida no roadmap; ativação comercial é gate separado e permanece OFF.

## Formato de evidência
Versão/commit: ...
Ambiente/URL: ...
Dispositivo/navegador: ...
Cenário: UAT-...
Resultado: PASS | FAIL | BLOCKED | N/A (justificado)
Esperado: ...
Obtido: ...
Evidência opcional: imagem com dados fictícios, sem segredos.

Não anexar backup verdadeiro, dados de diário, contas, tokens, chaves API, recibos reais ou informações pessoais. Nunca testar ações destrutivas em produção; usar staging.

## Sprint atual: v1.0.1
| Issue de engenharia | UAT do proprietário | Estado inicial |
|---|---|---|
| #1 MVC e histórico | #21 Aceitação funcional e histórico | Bloqueado até build de staging e CI |
| #3 CI/CD e ambientes | #22 Aceitação de release e ambientes | Bloqueado até pipeline, staging e aceite funcional |
PR #20 é draft. A v1.0 passou pelos sete testes manuais originais, mas isso não aprova automaticamente a v1.0.1. Engenharia ainda deve executar testes automatizados e corrigir regressões.
