"use client";

import { useMemo, useState, ChangeEvent } from "react";
import Tabela, { Column } from "@/components/table";
import { Button } from "./ui/button";
import Link from "next/link";

export type AtivoRow = {
  id: number | string;
  nome: string;
  tipo_modal: string; // Portos, Rodovias, ...
  estado: string; // "SP", "ES/MG", "Múltiplos"
  capacidade_extensao: string; // "132 milhões ton/ano", "476 km", etc.
  status: "Ativo" | "Inativo";
};

export default function AtivosTableClient({ data }: { data: AtivoRow[] }) {
  const [busca, setBusca] = useState("");
  const [filtroModal, setFiltroModal] = useState<string>("");

  const modais = useMemo(
    () => Array.from(new Set(data.map((d) => d.tipo_modal))).sort(),
    [data]
  );

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data.filter((d) => {
      const byText = !t || d.nome.toLowerCase().includes(t);
      const byModal = !filtroModal || d.tipo_modal === filtroModal;
      return byText && byModal;
    });
  }, [data, busca, filtroModal]);

  const columns: Column<AtivoRow>[] = [
    {
      key: "nome_ativo",
      header: "Nome",
      minWidth: "18rem",
      className: "font-medium",
    },
    { key: "tipo_modal", header: "Modal" },
    { key: "estado", header: "Estado" },
    {
      key: "capacidade_extensao",
      header: "Capacidade/Extensão",
      minWidth: "14rem",
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span
          className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1",
            r.status === "Ativo"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-rose-50 text-rose-700 ring-rose-200",
          ].join(" ")}
        >
          {r.status}
        </span>
      ),
    },
  ];

  function onBusca(e: ChangeEvent<HTMLInputElement>) {
    setBusca(e.target.value);
  }

  return (
    <section className="w-full p-4 sm:p-6">
      <div className="mb-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Ativos Cadastrados
          </h2>
          <Link href="/ativos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adicionar Ativo
            </Button>
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          Lista de todos os ativos de transporte no sistema
        </p>
      </div>

      {/* filtros */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={busca}
            onChange={onBusca}
            placeholder="Buscar ativos..."
            className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pr-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        <select
          value={filtroModal}
          onChange={(e) => setFiltroModal(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
        >
          <option value="">Todos os Modais</option>
          {modais.map((m, idx) => (
            <option key={`${m}-${idx}`} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <Tabela<AtivoRow>
        title=""
        description=""
        columns={columns}
        data={filtrados}
        rowKey={(r) => r.id}
        actionsHeader="Ações"
        renderActions={() => (
          <div className="flex justify-end gap-2">
            <Link href={`/ativos/editar/${filtrados[0]?.id}`}>
              <button className="rounded-md bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700 cursor-pointer">
                Editar
              </button>
            </Link>
            <button className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
              Ver Detalhes
            </button>
          </div>
        )}
      />
    </section>
  );
}
