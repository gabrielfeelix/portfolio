/* Gravação do formulário de briefing no Supabase.
 *
 * Por que existe uma função aqui, num projeto que é estático no resto todo:
 * a página do briefing é HTML puro e não tem como esconder chave nenhuma. Se
 * ela falasse direto com o Supabase, a chave estaria no código-fonte para
 * quem abrisse. Então a chave fica na variável de ambiente da Vercel e só
 * este arquivo a enxerga.
 *
 * A tabela está com RLS ligada e sem policy: a SECRET_KEY passa por cima, e
 * qualquer outra chave não alcança nada. Ver docs/supabase-briefing.sql no
 * repositório do cliente.
 *
 * Contrato:
 *   GET  /api/briefing?id=bertoncini-mendonca  → { respostas, atualizado_em }
 *   POST /api/briefing  { id, respostas }      → { ok: true, atualizado_em }
 *
 * O POST mescla no que já está gravado em vez de substituir. É o que permite
 * o Jus responder a parte dele hoje e a Bia abrir o mesmo link semana que vem
 * e completar, sem apagar o que o outro escreveu.
 */

const URL_BASE = "https://qoifhphjfjykweqymqxi.supabase.co";
const TABELA = "briefing_bertoncini_mendonca";

/* Só este briefing. Sem isso a rota viraria um banco de dados aberto para
   quem quisesse inventar um id. */
const IDS_ACEITOS = new Set(["bertoncini-mendonca"]);

/* Teto por gravação. O formulário inteiro preenchido com folga não chega
   perto disso; serve para um POST de má-fé não encher a tabela. */
const LIMITE_BYTES = 512 * 1024;

function chave() {
  const k = process.env.SUPABASE_SECRET_KEY;
  if (!k) throw new Error("SUPABASE_SECRET_KEY ausente no ambiente");
  return k;
}

function cabecalhos() {
  const k = chave();
  return {
    apikey: k,
    Authorization: `Bearer ${k}`,
    "Content-Type": "application/json",
  };
}

async function buscar(id) {
  const url = `${URL_BASE}/rest/v1/${TABELA}?id=eq.${encodeURIComponent(id)}&select=respostas,atualizado_em`;
  const r = await fetch(url, { headers: cabecalhos() });
  if (!r.ok) throw new Error(`supabase GET ${r.status}: ${await r.text()}`);
  const linhas = await r.json();
  return linhas[0] || null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const id = String(req.query.id || "");
      if (!IDS_ACEITOS.has(id)) return res.status(400).json({ erro: "id inválido" });
      const linha = await buscar(id);
      return res.status(200).json({
        respostas: linha ? linha.respostas : {},
        atualizado_em: linha ? linha.atualizado_em : null,
      });
    }

    if (req.method === "POST") {
      const corpo = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const id = String(corpo.id || "");
      if (!IDS_ACEITOS.has(id)) return res.status(400).json({ erro: "id inválido" });

      const novas = corpo.respostas;
      if (!novas || typeof novas !== "object" || Array.isArray(novas)) {
        return res.status(400).json({ erro: "respostas deve ser um objeto" });
      }
      if (JSON.stringify(novas).length > LIMITE_BYTES) {
        return res.status(413).json({ erro: "respostas grandes demais" });
      }

      /* Mescla com o que já existe. Campo vazio no POST não apaga o que estava
         lá: quem está preenchendo agora não carrega as respostas do outro no
         formulário, e um merge cego por chave apagaria tudo que ele não viu.
         Só entra chave com conteúdo. */
      const linha = await buscar(id);
      const atuais = linha ? linha.respostas || {} : {};
      const mescladas = { ...atuais };
      for (const [k, v] of Object.entries(novas)) {
        const vazio =
          v === null || v === undefined || (typeof v === "string" && !v.trim());
        if (!vazio) mescladas[k] = v;
      }

      const agora = new Date().toISOString();
      const r = await fetch(`${URL_BASE}/rest/v1/${TABELA}`, {
        method: "POST",
        headers: {
          ...cabecalhos(),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify([
          { id, respostas: mescladas, atualizado_em: agora },
        ]),
      });
      if (!r.ok) throw new Error(`supabase POST ${r.status}: ${await r.text()}`);

      return res.status(200).json({ ok: true, atualizado_em: agora });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ erro: "método não permitido" });
  } catch (e) {
    console.error("[briefing]", e);
    return res.status(500).json({ erro: "falha ao salvar" });
  }
}
