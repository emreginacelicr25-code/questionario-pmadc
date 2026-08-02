import React, { useMemo, useState } from "react";
import { EIXOS, CAMPOS, TOTAL_PERGUNTAS } from "./data/perguntas.js";
import PdfModal from "./components/PdfModal.jsx";
import { supabase } from "./supabaseClient.js";

const ETAPA_IDENTIFICACAO = "identificacao";
const ETAPA_REVISAO = "revisao";
const ETAPA_ENVIADO = "enviado";

export default function App() {
  const [pdfAberto, setPdfAberto] = useState(false);
  const [etapa, setEtapa] = useState(0); // 0 = identificação, 1..EIXOS.length = eixos, depois revisão
  const [nome, setNome] = useState("");
  const [segmento, setSegmento] = useState("");
  const [leuMinuta, setLeuMinuta] = useState("");
  const [respostas, setRespostas] = useState({});
  const [sinteseEditada, setSinteseEditada] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [fase, setFase] = useState(ETAPA_IDENTIFICACAO);

  const totalEtapas = EIXOS.length + 2; // identificação + eixos + revisão
  const progresso = Math.round((etapa / (totalEtapas - 1)) * 100);

  const respondidas = Object.values(respostas).filter((v) => v && v.trim().length > 0).length;

  // Agrupa respostas por campo (alterações / exclusões / inclusões / comentários), em tempo real
  const sinteseAutomatica = useMemo(() => {
    const grupos = { alteracoes: [], exclusoes: [], inclusoes: [], comentarios: [] };
    EIXOS.forEach((eixo) => {
      eixo.perguntas.forEach((p) => {
        const texto = respostas[p.id];
        if (texto && texto.trim()) {
          grupos[p.campo].push(`• [${eixo.numero} ${eixo.titulo}] ${texto.trim()}`);
        }
      });
    });
    return {
      alteracoes: grupos.alteracoes.join("\n"),
      exclusoes: grupos.exclusoes.join("\n"),
      inclusoes: grupos.inclusoes.join("\n"),
      comentarios: grupos.comentarios.join("\n"),
    };
  }, [respostas]);

  function atualizarResposta(id, valor) {
    setRespostas((prev) => ({ ...prev, [id]: valor }));
  }

  function irParaRevisao() {
    setSinteseEditada(sinteseAutomatica);
    setFase(ETAPA_REVISAO);
    setEtapa(EIXOS.length + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function avancar() {
    if (fase === ETAPA_IDENTIFICACAO) {
      if (!nome.trim()) {
        setErroNome("Preencha seu nome para continuar.");
        return;
      }
      setErroNome("");
      setFase("eixos");
      setEtapa(1);
    } else if (etapa < EIXOS.length) {
      setEtapa(etapa + 1);
    } else {
      irParaRevisao();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function voltar() {
    if (fase === ETAPA_REVISAO) {
      setFase("eixos");
      setEtapa(EIXOS.length);
    } else if (etapa === 1) {
      setFase(ETAPA_IDENTIFICACAO);
      setEtapa(0);
    } else if (etapa > 1) {
      setEtapa(etapa - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function enviar() {
    setEnviando(true);
    setErro("");
    const { error } = await supabase.from("respostas_pmadc").insert([
      {
        nome: nome.trim(),
        segmento: segmento || null,
        leu_minuta: leuMinuta || null,
        respostas,
        sintese_alteracoes: sinteseEditada.alteracoes,
        sintese_exclusoes: sinteseEditada.exclusoes,
        sintese_inclusoes: sinteseEditada.inclusoes,
        sintese_comentarios: sinteseEditada.comentarios,
      },
    ]);
    setEnviando(false);
    if (error) {
      setErro("Não foi possível enviar suas respostas. Verifique a conexão e tente novamente.");
      console.error(error);
      return;
    }
    setFase(ETAPA_ENVIADO);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pb-28">
      <PdfModal aberto={pdfAberto} onFechar={() => setPdfAberto(false)} />

      <header className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <p className="text-xs uppercase tracking-wide text-white/70">
            E.M. Regina Celi da Silva Cerdeira — Centro de Referência em Educação Inclusiva
          </p>
          <h1 className="mt-1 text-xl font-bold sm:text-2xl">
            Análise coletiva da Minuta da Política Municipal de Alfabetização (PMADC)
          </h1>
        </div>
      </header>

      {fase !== ETAPA_ENVIADO && (
        <div className="sticky top-0 z-30 bg-white shadow">
          <div className="mx-auto max-w-5xl px-4 py-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gold transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{respondidas} de {TOTAL_PERGUNTAS} perguntas respondidas</span>
              <button
                onClick={() => setPdfAberto(true)}
                className="rounded bg-navy/10 px-2 py-1 font-medium text-navy hover:bg-navy/20"
              >
                📄 Consultar a minuta
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl gap-6 px-4 py-6 lg:flex">
        <div className="min-w-0 flex-1">
          {fase === ETAPA_IDENTIFICACAO && (
            <IdentificacaoStep
              nome={nome}
              setNome={(v) => {
                setNome(v);
                if (v.trim()) setErroNome("");
              }}
              segmento={segmento}
              setSegmento={setSegmento}
              leuMinuta={leuMinuta}
              setLeuMinuta={setLeuMinuta}
              onAbrirPdf={() => setPdfAberto(true)}
              erroNome={erroNome}
            />
          )}

          {fase === "eixos" && (
            <EixoStep
              eixo={EIXOS[etapa - 1]}
              respostas={respostas}
              onChange={atualizarResposta}
            />
          )}

          {fase === ETAPA_REVISAO && sinteseEditada && (
            <RevisaoStep
              sintese={sinteseEditada}
              setSintese={setSinteseEditada}
              erro={erro}
            />
          )}

          {fase === ETAPA_ENVIADO && <ConfirmacaoStep />}
        </div>

        {fase !== ETAPA_IDENTIFICACAO && fase !== ETAPA_ENVIADO && (
          <ResumoLateral sintese={sinteseAutomatica} />
        )}
      </main>

      {fase !== ETAPA_ENVIADO && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <button
              onClick={voltar}
              disabled={fase === ETAPA_IDENTIFICACAO}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 disabled:opacity-0"
            >
              ← Voltar
            </button>
            {fase === ETAPA_REVISAO ? (
              <button
                onClick={enviar}
                disabled={enviando}
                className="rounded-md bg-gold px-6 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Enviar respostas"}
              </button>
            ) : (
              <button
                onClick={avancar}
                className="rounded-md bg-navy px-6 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
              >
                {fase === "eixos" && etapa === EIXOS.length ? "Ir para revisão final →" : "Avançar →"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ children }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">{children}</div>;
}

function IdentificacaoStep({ nome, setNome, segmento, setSegmento, leuMinuta, setLeuMinuta, onAbrirPdf, erroNome }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-navy">Bem-vindo(a)!</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Este questionário substitui o momento presencial de leitura coletiva e discussão previsto no
        roteiro da SME para o Planejamento Integrado. Suas respostas serão organizadas automaticamente
        nas colunas <b>Alterações</b>, <b>Exclusões</b> e <b>Inclusões</b> do quadro-anexo enviado à
        Secretaria Municipal de Educação, além de responder à pergunta norteadora oficial.
      </p>

      <button
        onClick={onAbrirPdf}
        className="mt-4 flex w-full items-center justify-between rounded-lg border-2 border-dashed border-gold/50 bg-gold/5 px-4 py-3 text-left hover:bg-gold/10"
      >
        <span className="text-sm font-medium text-gold">
          📄 Antes de começar, leia a minuta completa (PDF)
        </span>
        <span className="text-gold">→</span>
      </button>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Nome <span className="text-rose-600">*</span>
          </label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
              erroNome ? "border-rose-500 focus:border-rose-500" : "border-slate-300 focus:border-navy"
            }`}
            placeholder="Seu nome completo"
          />
          {erroNome && <p className="mt-1 text-xs font-medium text-rose-600">{erroNome}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Segmento em que atua</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Educação Infantil", "1º ao 5º ano", "Educação Especial", "AEE", "Outro"].map((op) => (
              <button
                key={op}
                onClick={() => setSegmento(op)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  segmento === op
                    ? "border-navy bg-navy text-white"
                    : "border-slate-300 text-slate-600 hover:border-navy"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Você realizou a leitura integral da minuta?
          </label>
          <div className="mt-2 flex gap-2">
            {["Sim", "Parcialmente", "Ainda não"].map((op) => (
              <button
                key={op}
                onClick={() => setLeuMinuta(op)}
                className={`rounded-md border px-3 py-2 text-sm ${
                  leuMinuta === op
                    ? "border-navy bg-navy text-white"
                    : "border-slate-300 text-slate-600 hover:border-navy"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function EixoStep({ eixo, respostas, onChange }) {
  return (
    <Card>
      <span className="text-xs font-semibold uppercase tracking-wide text-gold">Eixo {eixo.numero}</span>
      <h2 className="mt-1 text-lg font-bold text-navy">{eixo.titulo}</h2>
      <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
        {eixo.resumo}
      </p>

      <div className="mt-5 space-y-5">
        {eixo.perguntas.map((p) => (
          <div key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <label className="text-sm font-medium text-slate-800">{p.texto}</label>
            </div>
            <span
              className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${CAMPOS[p.campo].cor}`}
            >
              → {CAMPOS[p.campo].label}
            </span>
            <textarea
              value={respostas[p.id] || ""}
              onChange={(e) => onChange(p.id, e.target.value)}
              rows={p.destaque ? 5 : 3}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              placeholder="Escreva sua contribuição..."
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function RevisaoStep({ sintese, setSintese, erro }) {
  const campos = ["alteracoes", "exclusoes", "inclusoes", "comentarios"];
  return (
    <Card>
      <h2 className="text-lg font-bold text-navy">Revisão final</h2>
      <p className="mt-2 text-sm text-slate-600">
        Suas respostas já foram organizadas por coluna. Revise, ajuste ou complemente o texto de cada
        campo antes de enviar — este é o conteúdo que a equipe gestora usará para preencher o
        quadro-anexo enviado à SME.
      </p>

      <div className="mt-5 space-y-5">
        {campos.map((c) => (
          <div key={c}>
            <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${CAMPOS[c].cor}`}>
              {CAMPOS[c].label}
            </span>
            <textarea
              value={sintese[c]}
              onChange={(e) => setSintese((prev) => ({ ...prev, [c]: e.target.value }))}
              rows={5}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              placeholder={`Nenhuma contribuição em "${CAMPOS[c].label}" ainda — pode escrever aqui.`}
            />
          </div>
        ))}
      </div>

      {erro && <p className="mt-4 text-sm font-medium text-rose-600">{erro}</p>}
    </Card>
  );
}

function ConfirmacaoStep() {
  return (
    <Card>
      <h2 className="text-lg font-bold text-navy">Respostas enviadas! ✅</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Obrigado pela sua contribuição. Suas propostas de alteração, exclusão e inclusão, além da
        resposta à pergunta norteadora, já foram registradas e serão consolidadas pela equipe gestora
        no quadro-anexo enviado à Secretaria Municipal de Educação.
      </p>
    </Card>
  );
}

function ResumoLateral({ sintese }) {
  const campos = ["alteracoes", "exclusoes", "inclusoes", "comentarios"];
  return (
    <aside className="mt-6 hidden w-64 shrink-0 lg:mt-0 lg:block">
      <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Suas contribuições até agora
        </h3>
        <div className="mt-3 space-y-2">
          {campos.map((c) => {
            const n = sintese[c] ? sintese[c].split("\n").filter(Boolean).length : 0;
            return (
              <div
                key={c}
                className={`flex items-center justify-between rounded-md border px-2 py-1.5 text-xs font-medium ${CAMPOS[c].cor}`}
              >
                <span>{CAMPOS[c].label}</span>
                <span className="rounded-full bg-white/70 px-2 font-bold">{n}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
