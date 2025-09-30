"use client";

import { useMemo, useState, ChangeEvent } from "react";
import Tabela, { Column } from "@/components/table";
import Link from "next/link";
import { Button } from "./ui/button";

export type ProjetoRow = {
  id: number | string;
  projeto: string;
  modal: string;
  status:
    | "Em Andamento"
    | "Planejamento"
    | "Licitação"
    | "Estudo"
    | "Concluído";
  responsavel: string;
  investimento: string; // ex: "R$ 150M"
  prazo: string; // ex: "Dez/2024"
};

export default function ProjetosTableClient({ data }: { data: ProjetoRow[] }) {
  const [busca, setBusca] = useState("");
  const [filtroModal, setFiltroModal] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("");

  const modais = useMemo(
    () => Array.from(new Set(data.map((d) => d.modal))).sort(),
    [data]
  );
  const statusList = useMemo(
    () => Array.from(new Set(data.map((d) => d.status))).sort(),
    [data]
  );

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data.filter((d) => {
      const byText = !t || d.projeto.toLowerCase().includes(t);
      const byModal = !filtroModal || d.modal === filtroModal;
      const byStatus = !filtroStatus || d.status === filtroStatus;
      return byText && byModal && byStatus;
    });
  }, [data, busca, filtroModal, filtroStatus]);

  const columns: Column<ProjetoRow>[] = [
    {
      key: "projeto",
      header: "Projeto",
      minWidth: "20rem",
      className: "font-medium",
    },
    { key: "modal", header: "Modal" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
      minWidth: "10rem",
    },
    { key: "responsavel", header: "Responsável", minWidth: "14rem" },
    { key: "investimento", header: "Investimento" },
    { key: "prazo", header: "Prazo" },
  ];

  function onBusca(e: ChangeEvent<HTMLInputElement>) {
    setBusca(e.target.value);
  }

  return (
    <section className="w-full p-4 sm:p-6">
      <div className="mb-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Projetos Cadastrados
          </h2>

          <Link href="/projetos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adicionar Projeto
            </Button>
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          Lista de todos os projetos de infraestrutura no sistema.
        </p>
      </div>

      {/* filtros */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={busca}
            onChange={onBusca}
            placeholder="Buscar..."
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
          {modais.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
        >
          <option value="">Todos os Status</option>
          {statusList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Tabela<ProjetoRow>
        title=""
        description=""
        columns={columns}
        data={filtrados}
        rowKey={(r) => r.id}
        actionsHeader="Ações"
        renderActions={() => (
          <div className="flex justify-end gap-2">
            <button className="rounded-md bg-blue-600 px-2.5 py-1 text-xs text-white hover:bg-blue-700 cursor-pointer">
              Editar
            </button>
            <button className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
              Ver Detalhes
            </button>
          </div>
        )}
      />
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "Em Andamento"
    | "Planejamento"
    | "Licitação"
    | "Estudo"
    | "Concluído";
}) {
  const map: Record<string, string> = {
    "Em Andamento": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Planejamento: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    Licitação: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200",
    Estudo: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    Concluído: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        map[status] || ""
      }`}
    >
      {status}
    </span>
  );
}
