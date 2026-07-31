import React from "react";

export default function PdfModal({ aberto, onFechar }) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div className="flex h-full w-full max-w-4xl flex-col rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-navy">Minuta_PMADC.pdf</h2>
          <div className="flex items-center gap-3">
            <a
              href={`${import.meta.env.BASE_URL}minuta-pmadc.pdf`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-navy underline"
            >
              Abrir em nova aba
            </a>
            <button
              onClick={onFechar}
              className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Fechar ✕
            </button>
          </div>
        </div>
        <iframe
          title="Minuta da Política Municipal de Alfabetização"
          src={`${import.meta.env.BASE_URL}minuta-pmadc.pdf`}
          className="h-full w-full flex-1 rounded-b-lg"
        />
      </div>
    </div>
  );
}
