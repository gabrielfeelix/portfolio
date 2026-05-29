# Integração de Conteúdo dos Projetos — Plano (READ-ONLY recon → população)

**Regra de ouro:** os outros repositórios em `~/dev/` são **somente leitura**. Nada é
deletado, movido ou alterado fora de `portfolio/`. Cópia só no sentido projeto → portfólio.

## Recon feito (read-only)

| Projeto (nosso id) | Pasta | O que é (real, do README) | Tech | Repo |
|---|---|---|---|---|
| Traxium (`traxium`) | `~/dev/gabriel/traxium` | "Protótipo SaaS de Compliance Agrologística" — back-office web p/ gestores de transportadora + preview do app mobile do motorista | Next.js 16, TS, Tailwind v4, shadcn/ui, Recharts | github.com/gabrielfeelix/traxium |
| Boxe (`argel`) | `~/dev/gabriel/ct-boxe` | "Sistema completo de gerenciamento do CT de Boxe — Equipe Argel Riboli". Monorepo web (Next.js) + app (React Native/Expo) + shared | Next.js, React Native/Expo, TS | github.com/gabrielfeelix/sistema-ct-boxe |
| Solar Buy-Side (`solar-site`) | `~/dev/gabriel/solar-buy-side` | Landing page (React/TS/Tailwind, Vite) | React, TS, Tailwind, Vite | github.com/gabrielfeelix/solar-buy-side-v2 |
| Hub Oderço (`hub-oderco`) | `~/dev/Gerador-HTML` | "Hub de Produtos & Serviços" — ecossistema multi-empresa: automação de marketing, geração de descrições via IA, e-mail mkt. Atende 7 marcas (PCYES, Azux, ODEX, Tonante, Quati, Skul, Vinik) | (root multi-app) | github.com/gabrielfeelix/PCYES-Products |
| PCYES (`pcyes`) | `~/dev/hub-ux-oderco/empresas/pcyes/projetos/pcyes-v2/versoes/v3` | E-commerce PCYES (v3 oficial) | — | — |
| Checkout Oderço | `~/dev/hub-ux-oderco/empresas/oderco/projetos/checkout/cart-checkout-v1` | Fluxo de checkout (v1 oficial) | — | — |
| Local AI Studio | `~/dev/local-ai-studio-main` | "Interface local para Claude Code/Gemini/Codex — 100% privado, sem API keys"; gera/itera React/Vite com preview | — | github.com/gabrielfeelix/local-ai-studio |

### Imagens utilizáveis (caminhos reais)
- **Logos de marca** (ótimo p/ logos de empresa/projeto): `~/dev/Gerador-HTML/logotipos/` → Odex, Tonante, Vinik, Skul, Quati, PCYES símbolos; `Logotipo_Vermelho.svg`, `LOGO_Simbolo.png`.
- **Solar**: `assets/img-hero-solar.png`, `public/assets/LOGOSOLARBUYSIDE3.png`, vários mockups/capas.
- **Boxe**: `logo-ct.png`, `CT Argel Riboli Design System/assets/` (logo + ícones + splash).
- **PCYES v3**: `public/assets/banner-{1,2,3}.png`, product imgs, `public/setups/setup-*.png`.
- **Checkout v1**: `src/assets/*.png` (exports Figma com hash — precisa identificar visualmente quais servem).
- **Traxium**: só tem svgs do Next (sem screenshots reais salvos → precisaria rodar/printar).

## Lacunas / decisões (NÃO vou chutar)
1. **Odex v3 oficial:** você disse Odex oficial = v3, mas em `odex/projetos` só há `website/versoes/{v1,v2}` e `plataforma/{v1,v2,v3}` — e você disse pra **NÃO usar a plataforma**. Onde está o "Odex v3" que devo usar? (website não tem v3.)
2. **Links Vercel:** os configs só têm `localhost`/GitHub. Não achei URL `*.vercel.app` pública pra nenhum. Quais são os links de protótipo (Vercel) de cada um? (não vou inventar URL.)
3. **Screenshots de cover:** Traxium/Odex (Next/Vite) não têm prints salvos. Quer que eu (a) use banners/mockups existentes, (b) você exporta prints, ou (c) deixo o painel mangá (screentone) sem foto por enquanto?
4. **Local AI Studio e Telegram bot:** entram como projetos no portfólio ou standby?

## Próximos passos (após seu OK)
1. **Wiring de imagem nas capas:** hoje as capas usam `MangaPlate` (placeholder screentone). Adicionar suporte a `cover` (imagem real) em `PROJECTS`/`CHAPTERS`, com fallback pro MangaPlate. (feature nova, mexe no visual — por isso quero seu OK.)
2. **Copiar assets** escolhidos: `projeto → portfolio/volume/assets/projetos/<id>/`.
3. **Popular `data.jsx`:** descritores reais + storytelling (problema/decisão/solução/resultado) com base nos READMEs, + links Vercel/GitHub que você confirmar.
4. **Logos de empresa:** `ttt.png`/`locarmais.png`/`oderco.png` — você ainda precisa fornecer (não achei TT&T/Locarmais/Grupo-Oderço nos repos; o Hub tem símbolos de marca, não o logo do grupo).

## Já entregue nesta rodada (seguro)
- Fontes JP de mangá: **Reggae One** (SFX kana) + **Yuji Mai** (katakana da hero).
- `translate="no" lang="ja"` nos kana → navegador não tenta traduzir os SFX.
- Katakana da hero: `ガブリエル` (seu nome — vibe de capa de volume).
