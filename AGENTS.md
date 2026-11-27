# Orientações para desenvolvimento
Leia docs/ROADMAP.md e as Issues antes de alterar o projeto. O proprietário aprova mudanças de escopo e promoção a produção.
- Trabalhe em branch dedicada, commits pequenos, PR revisável. Não faça merge em main nem ative cobrança sem aprovação.
- Issue #1/#3 são o escopo corrente. Funcionalidades futuras ficam em Issues, não em commits desta versão.
- Preserve dados locais e compatibilidade de backups; teste regressões e informe explicitamente testes não executados.
- Não inclua dados pessoais, backups, credenciais, chaves IA ou tokens em código, Issues, logs, fixtures ou commits.
- Código legível e modular, responsabilidades MVC, dependências explícitas; evite frameworks e infraestrutura novos sem justificativa aprovada.
- Não marque Issue como concluída sem critérios de aceitação e evidência de teste.

- Siga docs/QUALIDADE_E_HOMOLOGACAO.md; cada Issue tem DoD, UAT específica quando em execução e aceite registrado. Atualize docs/MANUAL_USUARIO.md a cada entrega; funcionalidades futuras não devem parecer disponíveis.
