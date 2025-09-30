"use client";

import { useMemo, useState, ChangeEvent } from "react";
import Tabela, { Column } from "@/components/table";

export type ExtensionRow = {
  id: number | string;
  nome: string;
  estado: string;
  capacidade_extensao: string;
  status:
    | "Em Andamento"
    | "Planejamento"
    | "Licitação"
    | "Estudo"
    | "Concluído";
};

export default function ExtensionTable({
  data,
  title,
  description,
}: {
  data: ExtensionRow[];
  title: string;
  description: string;
}) {
  const [busca, setBusca] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("");

  const estados = useMemo(
    () => Array.from(new Set(data.map((d) => d.estado))).sort(),
    [data]
  );
  const statusList = useMemo(
    () => Array.from(new Set(data.map((d) => d.status))).sort(),
    [data]
  );

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return data.filter((d) => {
      const byText = !t || d.nome.toLowerCase().includes(t);
      const byEstado = !filtroEstado || d.estado === filtroEstado;
      const byStatus = !filtroStatus || d.status === filtroStatus;
      return byText && byEstado && byStatus;
    });
  }, [data, busca, filtroEstado, filtroStatus]);

  const columns: Column<ExtensionRow>[] = [
    {
      key: "nome_ativo",
      header: "Projeto",
      minWidth: "20rem",
      className: "font-medium",
    },
    { key: "estado", header: "UF" },
    { key: "capacidade_extensao", header: "Extensão" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
      minWidth: "10rem",
    },
  ];

  function onBusca(e: ChangeEvent<HTMLInputElement>) {
    setBusca(e.target.value);
  }

  return (
    <section className="w-full p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
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
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
        >
          <option value="">Todos os Estados</option>
          {estados.map((m) => (
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

      <Tabela<ExtensionRow>
        title=""
        description=""
        columns={columns}
        data={filtrados}
        rowKey={(r) => r.id}
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
