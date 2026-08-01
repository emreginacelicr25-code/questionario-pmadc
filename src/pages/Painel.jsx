import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

// Senha simples de acesso ao painel — mesmo padrão usado nos demais sistemas da escola.
// Altere aqui quando quiser trocar a senha.
const SENHA_PAINEL = "pmadc2026";

export default function Painel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [respostas, setRespostas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [aba, setAba] = useState("consolidado");

  useEffect(() => {
    if (autenticado) carregar();
  }, [autenticado]);

  async function carregar() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("respostas_pmadc")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setRespostas(data || []);
    setCarregando(false);
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (senha === SENHA_PAINEL) setAutenticado(true);
          }}
          className="w-full max-w-sm rounded-xl bg-white p-6 shadow"
        >
          <h1 className="text-lg font-bold text-navy">Painel de consolidação — PMADC</h1>
          <p className="mt-1 text-sm text-slate-500">Acesso restrito à equipe gestora.</p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button className="mt-3 w-full rounded-md bg-navy py-2 text-sm font-semibold text-white">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const consolidado = {
    alteracoes: respostas.map((r) => r.sintese_alteracoes).filter(Boolean).join("\n"),
    exclusoes: respostas.map((r) => r.sintese_exclusoes).filter(Boolean).join("\n"),
    inclusoes: respostas.map((r) => r.sintese_inclusoes).filter(Boolean).join("\n"),
    comentarios: respostas.map((r) => r.sintese_comentarios).filter(Boolean).join("\n"),
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <header className="bg-navy px-4 py-5 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-lg font-bold sm:text-xl">Painel de consolidação — PMADC</h1>
          <p className="text-sm text-white/70">{respostas.length} respostas recebidas</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4">
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setAba("consolidado")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${aba === "consolidado" ? "bg-navy text-white" : "bg-white text-slate-600"}`}
          >
            Quadro consolidado
          </button>
          <button
            onClick={() => setAba("individuais")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${aba === "individuais" ? "bg-navy text-white" : "bg-white text-slate-600"}`}
          >
            Respostas individuais
          </button>
          <button
            onClick={carregar}
            className="ml-auto rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-600"
          >
            {carregando ? "Atualizando..." : "🔄 Atualizar"}
          </button>
        </div>

        {aba === "consolidado" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-500">
                Texto pronto para colar diretamente no quadro-anexo (Escola / Alterações / Exclusões /
                Inclusões / Comentários gerais) a ser enviado a formacaocontinuada@smeduquedecaxias.rj.gov.br.
              </p>
              <button
                onClick={() => window.print()}
                className="shrink-0 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
              >
                🖨️ Baixar PDF do quadro
              </button>
            </div>
            <BlocoConsolidado titulo="Alterações" texto={consolidado.alteracoes} />
            <BlocoConsolidado titulo="Exclusões" texto={consolidado.exclusoes} />
            <BlocoConsolidado titulo="Inclusões" texto={consolidado.inclusoes} />
            <BlocoConsolidado titulo="Comentários gerais" texto={consolidado.comentarios} />
          </div>
        )}

        {aba === "individuais" && (
          <div className="mt-4 space-y-3">
            {respostas.map((r) => (
              <details key={r.id} className="rounded-lg bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-navy">
                  {r.nome || "Anônimo"} — {r.segmento || "segmento não informado"} —{" "}
                  {new Date(r.created_at).toLocaleString("pt-BR")}
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  <p><b>Leu a minuta:</b> {r.leu_minuta || "—"}</p>
                  <p><b>Alterações:</b> {r.sintese_alteracoes || "—"}</p>
                  <p><b>Exclusões:</b> {r.sintese_exclusoes || "—"}</p>
                  <p><b>Inclusões:</b> {r.sintese_inclusoes || "—"}</p>
                  <p><b>Comentários gerais:</b> {r.sintese_comentarios || "—"}</p>
                </div>
              </details>
            ))}
            {respostas.length === 0 && !carregando && (
              <p className="text-sm text-slate-500">Nenhuma resposta recebida ainda.</p>
            )}
          </div>
        )}
      </div>

      {/* Folha formatada — só aparece ao imprimir / salvar como PDF */}
      <div id="area-impressao" className="hidden print:block">
        <div className="text-center text-sm font-bold leading-tight">
          <p>ESTADO DO RIO DE JANEIRO</p>
          <p>PREFEITURA MUNICIPAL DE DUQUE DE CAXIAS</p>
          <p>SECRETARIA MUNICIPAL DE EDUCAÇÃO</p>
          <p>SUBSECRETARIA PEDAGÓGICA</p>
          <p>DEPARTAMENTO DE EDUCAÇÃO BÁSICA</p>
        </div>

        <table className="mt-6 w-full border-collapse text-xs">
          <tbody>
            <tr>
              <td className="border border-black bg-slate-100 px-2 py-1 font-bold" colSpan={3}>
                Escola: E.M. Regina Celi da Silva Cerdeira
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-slate-100 px-2 py-1 font-bold">Alterações</td>
              <td className="border border-black bg-slate-100 px-2 py-1 font-bold">Exclusões</td>
              <td className="border border-black bg-slate-100 px-2 py-1 font-bold">Inclusões</td>
            </tr>
            <tr>
              <td className="whitespace-pre-wrap border border-black px-2 py-2 align-top">
                {consolidado.alteracoes || "—"}
              </td>
              <td className="whitespace-pre-wrap border border-black px-2 py-2 align-top">
                {consolidado.exclusoes || "—"}
              </td>
              <td className="whitespace-pre-wrap border border-black px-2 py-2 align-top">
                {consolidado.inclusoes || "—"}
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-slate-100 px-2 py-1 font-bold" colSpan={3}>
                Comentários gerais
              </td>
            </tr>
            <tr>
              <td className="whitespace-pre-wrap border border-black px-2 py-2 align-top" colSpan={3}>
                {consolidado.comentarios || "—"}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-3 text-[10px] text-slate-500">
          Consolidado a partir de {respostas.length} resposta(s) — gerado em{" "}
          {new Date().toLocaleString("pt-BR")}
        </p>
      </div>
    </div>
  );
}

function BlocoConsolidado({ titulo, texto }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-navy">{titulo}</h3>
        <button
          onClick={() => navigator.clipboard.writeText(texto || "")}
          className="text-xs font-medium text-gold underline"
        >
          Copiar
        </button>
      </div>
      <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-slate-700">
        {texto || "— nenhuma contribuição ainda —"}
      </pre>
    </div>
  );
}
