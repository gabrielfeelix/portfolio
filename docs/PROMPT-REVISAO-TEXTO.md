# Prompt — revisão geral de texto do portfólio

Copie tudo abaixo da linha e envie numa sessão nova.

---

Vamos fazer uma revisão geral do TEXTO do meu portfólio, em 4 etapas com aprovação minha entre cada uma.

## Contexto do repositório

`/home/gabfelix/dev/portfolio` — portfólio pessoal de UX/UI em formato de volume de mangá. Build sem framework (esbuild + React via `<script>`), publicado em 4yu.com.br.

O texto está espalhado assim:

| Arquivo | O que tem |
|---|---|
| `volume/data.jsx` | **O grosso.** Os 5 capítulos inteiros: títulos, parágrafos, legendas de figura, notas, leituras de dado |
| `volume/i18n.jsx` | Espelho em inglês de TODO o `data.jsx` |
| `volume/Posfacio.jsx` | Posfácio, com PT e EN inline via `t(pt, en)` |
| `volume/Capitulo.jsx` | Rótulos e textos de navegação do capítulo |
| `volume/Capa.jsx` | Home e sumário |
| `volume/Processo.jsx` | O bloco de método |
| `volume/app.jsx` | Textos soltos de interface |

Os 5 capítulos são: `pcyes` (e-commerce, o principal, 18 min), `locarmais-conciliacao`, `odex`, `oderco-revenda`, `portfolio`.

## Minha queixa, nas minhas palavras

Acho o texto ruim. Cringe, repetitivo, cheio de frase de impacto. Não tem texto corrido, não parece humano falando, não está bem amarrado nem conciso.

**Não assuma que estou certo, e não herde diagnóstico de ninguém.** Quero que você leia e chegue à sua própria conclusão sobre o que está acontecendo — inclusive se discordar de mim, ou se o problema for outro. Se você achar que parte do texto está boa, diga, com evidência.

## Regras

1. **Use SOMENTE as skills listadas em cada etapa.** Nenhuma outra, mesmo que pareça relevante. Se achar que falta alguma, me pergunte antes.
2. **Pare ao fim de cada etapa** e me apresente o resultado. Não avance sem meu ok.
3. **Nas etapas 1 e 2 não altere nenhum arquivo.** São diagnóstico e definição de alvo.
4. **Só mexa em texto.** Nada de layout, componente, CSS ou estrutura de dados.
5. **PT e EN andam juntos.** Toda alteração em `data.jsx` precisa da correspondente em `i18n.jsx`, e nos arquivos com `t(pt, en)` os dois lados mudam na mesma edição. Inglês desatualizado é regressão.
6. **Não invente número, resultado nem citação.** Os dados vêm de GA4, Clarity e notas fiscais e estão marcados no código com a fonte. Se um trecho depender de dado que você não consegue verificar no repositório, marque como pendência em vez de reescrever por cima.

---

## Etapa 1 — Diagnóstico

**Skills:** `reader-sim` e `design-portfolio-audit`

Leia o portfólio como leitor, não como revisor.

- Com `reader-sim`, leia o capítulo `pcyes` inteiro na persona de **um hiring manager de produto que tem 6 minutos e 40 portfólios na fila**. Relate a experiência sentida beat a beat: onde engaja, onde cansa, onde pula, onde desconfia, onde para de ler. Quero o relato do que foi *sentido*, não a crítica analítica.
- Depois rode o mesmo com uma segunda persona à sua escolha, que você justifique.
- Com `design-portfolio-audit`, avalie se o texto ajuda ou atrapalha a passar no primeiro filtro de contratação.

**Entrega:** um relatório em `docs/` com o relato de leitura das duas personas, os pontos exatos (arquivo e trecho) onde a leitura quebra, e a sua tese sobre qual é o problema real. Ranqueie por impacto. Diga explicitamente onde você concorda e onde discorda da minha queixa.

---

## Etapa 2 — Definir o alvo

**Skills:** `brand-voice` e `writing-principles`

Sem um alvo escrito, revisar 5 capítulos produz 5 vozes diferentes. Esta etapa produz o alvo.

- Com `brand-voice`, extraia a voz que **já existe** nos trechos que funcionam e escreva o guia: tom, ritmo, vocabulário, o que fazer e o que não fazer. Não invente uma voz nova — destile a minha a partir do que já está lá.
- Com `writing-principles`, explique quais mecanismos estão sendo queimados nos trechos que não funcionam.

**Entrega:** `docs/VOZ.md` — o guia de voz, com exemplos "assim sim / assim não" tirados do meu próprio texto. Curto e utilizável, não um documento de marca de 20 páginas.

---

## Etapa 3 — Revisão, capítulo a capítulo

**Skills:** `story-review` e `copy-editing`

Uma página por vez, na ordem: `pcyes` → `locarmais-conciliacao` → `odex` → `oderco-revenda` → `portfolio` → home/sumário (`Capa.jsx`) → método (`Processo.jsx`) → posfácio (`Posfacio.jsx`).

Para cada uma:

- Com `story-review`, faça a crítica editorial **do conjunto**: continuidade, voz e repetição de recurso ao longo do volume inteiro, não bloco a bloco. Coisas que só aparecem quando se lê tudo seguido.
- Com `copy-editing`, proponha a revisão contra o `docs/VOZ.md`. **Melhore o que existe, não reescreva do zero** — preserve o que está funcionando e diga o que preservou.

**Pare depois de cada página** e me mostre o antes/depois em diff antes de seguir para a próxima. Aplique as edições em PT e EN.

**Entrega por página:** o diff aplicado, mais uma nota curta do que mudou e por quê.

---

## Etapa 4 — Passada final

**Skill:** `anti-ai-writing`

Com o volume inteiro já revisado, passe o filtro final no texto completo, lendo de ponta a ponta.

**Entrega:** a lista do que ainda soa formulaico depois da etapa 3, com as correções aplicadas.

---

Comece pela Etapa 1. Antes de qualquer coisa, invoque `reader-sim` e `design-portfolio-audit`, e me confirme que leu esta estrutura toda.
