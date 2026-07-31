# questionario-pmadc

Plataforma dinâmica de análise coletiva da minuta da Política Municipal de Alfabetização
de Duque de Caxias (PMADC), substituindo o momento presencial de Planejamento Integrado.

Segue o padrão do **Universo Digital** da escola: React + Vite + Tailwind, hospedado no
**GitHub Pages** (build automático via GitHub Actions), com **Supabase** como backend, sob
a organização GitHub `emreginacelicr25-code`.

## O que o sistema faz

- Questionário em etapas (uma por eixo temático da minuta), com barra de progresso e
  painel lateral mostrando, em tempo real, quantas contribuições já foram dadas para cada
  coluna (Alterações / Exclusões / Inclusões / Comentários gerais).
- Botão "Consultar a minuta" disponível em qualquer etapa, abrindo o PDF embutido
  (`public/minuta-pmadc.pdf`, já incluído no projeto) sem sair do formulário.
- Etapa final de revisão: mostra o texto já organizado por coluna (gerado a partir das
  respostas de cada eixo) e permite editar antes de enviar.
- Painel de gestão em `/#painel` (senha padrão `pmadc2026`, definida em
  `src/pages/Painel.jsx`): mostra o quadro já consolidado com todas as respostas somadas
  por coluna — pronto para copiar e colar no quadro-anexo enviado à SME — além da lista
  de respostas individuais.

## Passo a passo para publicar

### 1. Repositório

Crie um novo repositório em `emreginacelicr25-code` chamado **`questionario-pmadc`** e
envie todos os arquivos deste pacote (pode ser pelo editor web do GitHub, arrastando os
arquivos/pastas — inclusive as ocultas `.github/` e `.gitignore`).

> Se usar outro nome de repositório, ajuste a linha `base:` em `vite.config.js` para
> `"/NOME-DO-REPOSITORIO/"`.

### 2. Criar o projeto novo no Supabase

- Crie um projeto novo (ex.: conta/organização `emreginacelicr25-code`, nome sugerido
  `rcsc-pmadc`).
- Abra o **SQL Editor** e execute o conteúdo de `supabase/schema.sql`.
- Em *Project Settings → API*, copie a **Project URL** e a chave **anon public**.

### 3. Guardar as credenciais como Secrets do repositório

Como o GitHub Pages não tem variáveis de ambiente em tempo de execução (o site é só
HTML/JS estático), as credenciais do Supabase são "gravadas" no código durante o build,
que roda no GitHub Actions. Por isso, em vez de colar a URL e a chave direto no código,
cadastre-as como segredos do repositório:

Vá em **Settings → Secrets and variables → Actions → New repository secret** e crie:

- `VITE_SUPABASE_URL` = URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` = chave anon public

### 4. Ativar o GitHub Pages via GitHub Actions

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**
(em vez de "Deploy from a branch").

Assim que o repositório receber o primeiro push na branch `main`, o workflow
`.github/workflows/deploy.yml` builda o site automaticamente (`npm install` +
`npm run build`, injetando os secrets acima) e publica em:

```
https://emreginacelicr25-code.github.io/questionario-pmadc/
```

A cada novo commit em `main`, o site é atualizado sozinho — mesmo fluxo automático que
vocês já usam nos outros sistemas.

### 5. Divulgar

- Link para os professores: `https://emreginacelicr25-code.github.io/questionario-pmadc/`
- Link só para a equipe gestora (consolidação):
  `https://emreginacelicr25-code.github.io/questionario-pmadc/#painel`

## Editar as perguntas

Todo o conteúdo do questionário (eixos, resumos, perguntas e para qual coluna cada uma
aponta) está em `src/data/perguntas.js`. Basta editar esse arquivo — a barra de
progresso, o painel lateral e a revisão final se ajustam automaticamente ao número de
perguntas.

## Trocar a senha do painel

Edite a constante `SENHA_PAINEL` em `src/pages/Painel.jsx`.

## Testar localmente antes de publicar (opcional)

Se quiser rodar em um computador com Node.js instalado:

```
npm install
npm run dev
```

Crie um arquivo `.env.local` na raiz com `VITE_SUPABASE_URL=...` e
`VITE_SUPABASE_ANON_KEY=...` para testar a conexão com o Supabase localmente (esse
arquivo não deve ser enviado ao GitHub — já está no `.gitignore`).
