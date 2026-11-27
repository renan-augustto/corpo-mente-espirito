# Hospedagem e homologação web — v1.0.1

## Configuração observada em 27/11/2026

O proprietário confirmou pelas telas do Cloudflare Pages a integração GitHub e o primeiro deploy bem-sucedido da branch main.

- Projeto: corpo-mente-espirito.
- Produção Cloudflare: https://corpo-mente-espirito.pages.dev/
- Origem legada GitHub Pages: https://renan-augustto.github.io/corpo-mente-espirito/ (preservar enquanto houver dados locais a migrar).
- Production branch: main; deploy automático habilitado.
- Preview: All non-Production branches.
- Build output: dist; raiz padrão; sem variáveis necessárias nesta etapa.
- Build command:

```sh
mkdir -p dist && cp index.html app.js style.css manifest.webmanifest sw.js dist/ && cp -R src icons dist/
```

## Homologação

A PR #23 usa refactor/mvc-v1.0.1-phase2. A branch gera previews automaticamente; o CI deve aprovar o SHA antes da homologação. A URL exata e o resultado do deploy devem ser confirmados no painel Deployments ou no status GitHub. Este documento não comprova que o preview já foi publicado.
O preview de branch tem origem distinta da produção; verificar que armazenamento local, cache e rotinas de teste ficam isolados. Não usar dados pessoais em previews. Pré-visualizações podem ser públicas mesmo se o repositório for privado; restringir acesso antes de usar conteúdo sensível. Não confundir sucesso de build com aprovação dos testes.
Manter PR em Draft até CI e validação técnica; homologar apenas candidato identificado por SHA, preferencialmente URL imutável do deploy. Registrar evidências e aceite em #22 e retestes de #1.
Como a main publica automaticamente, o merge autorizado constitui o gate de produção; não fazer merge antes de CI, homologação e autorização explícita. Proteção da main e CI confirmados em 27/11/2026; ambiente develop permanente ainda pendente. GitHub Pages permanece ativo nesta transição. Exportar backup JSON na origem antiga antes de migrar; não apagar dados locais.
Sem ativação de cobrança, backend, login ou mudança de escopo comercial. Antecipação exclusivamente da hospedagem web de #11 para atender #3, conforme configuração realizada pelo proprietário.
