"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

type FormFields = {
  id?: string | string[];
  tipo_modal: string;
  nome_ativo: string;
  estado: string;
  municipio: string;
  status: "Ativo" | "Inativo";
  latitude: string;
  longitude: string;
  endereco: string;
  operador: string;
  horario: string;
  observacoes: string;
  capacidade_extensao: string;
};

export default function FormAtivo({
  prevData,
}: {
  prevData?: Partial<FormFields>;
}) {
  const [formData, setFormData] = useState<FormFields>({
    id: prevData?.id,
    tipo_modal: prevData?.tipo_modal || "",
    nome_ativo: prevData?.nome_ativo || "",
    estado: prevData?.estado || "",
    municipio: prevData?.municipio || "",
    status: (prevData?.status as FormFields["status"]) || "Ativo",
    latitude: prevData?.latitude || "",
    longitude: prevData?.longitude || "",
    endereco: prevData?.endereco || "",
    operador: prevData?.operador || "",
    horario: prevData?.horario || "",
    observacoes: prevData?.observacoes || "",
    capacidade_extensao: prevData?.capacidade_extensao || "",
  });
  console.log("prevData", prevData?.tipo_modal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pega o id da rota e salva no estado corretamente
  const params = useParams<{ id?: string }>();
  useEffect(() => {
    if (params?.id) {
      setFormData((p) => ({ ...p, id: params.id }));
    }
  }, [params?.id]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ativos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar ativo");
      }
      if (!params?.id) {
        toast("Ativo cadastrado com sucesso!");
      } else {
        toast("Ativo atualizado com sucesso!");
      }
      handleClear();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao cadastrar o ativo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClear() {
    setFormData({
      tipo_modal: "",
      nome_ativo: "",
      estado: "",
      municipio: "",
      status: "Ativo",
      latitude: "",
      longitude: "",
      endereco: "",
      operador: "",
      horario: "",
      observacoes: "",
      capacidade_extensao: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 sm:p-8"
      aria-labelledby="form-title"
    >
      {/* Campo oculto para id */}
      <input
        type="hidden"
        name="id"
        value={
          Array.isArray(formData?.id)
            ? formData.id[0] ?? ""
            : formData?.id ?? ""
        }
        readOnly
      />

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
        {/* Cabeçalho */}
        <div className="border-b border-slate-200 bg-slate-50/60 p-5 sm:p-6 rounded-t-2xl">
          <h2
            id="form-title"
            className="text-2xl font-semibold tracking-tight text-slate-800"
          >
            Cadastrar Novo Ativo
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Preencha as informações do ativo. Campos essenciais têm destaque.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="grid gap-6 p-5 sm:p-6">
          {/* Tipo de Modal */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                1
              </span>
              Tipo de Modal
            </h3>

            <div className="grid gap-3 sm:max-w-md">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="tipoModal"
              >
                Modal do Ativo
              </label>
              <select
                id="tipoModal"
                name="tipo_modal"
                value={formData.tipo_modal}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecione o tipo de modal</option>
                <option value="porto">Porto</option>
                <option value="aeroporto">Aeroporto</option>
                <option value="rodoviário">Rodovia</option>
                <option value="dutovia">Dutovia</option>
                <option value="ferrovia">Ferrovia</option>
                <option value="apoio-economico">Apoio Econômico</option>
              </select>
            </div>
          </section>

          {/* Informações Básicas */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                2
              </span>
              Informações Básicas
            </h3>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="nomeAtivo"
                >
                  Nome do Ativo <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomeAtivo"
                  type="text"
                  name="nome_ativo"
                  placeholder="Ex: Porto de Santos"
                  value={formData.nome_ativo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="estado"
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecione o estado</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="municipio"
                  >
                    Município <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="municipio"
                    type="text"
                    name="municipio"
                    placeholder="Ex: Santos"
                    value={formData.municipio}
                    onChange={handleChange}
                    required
                    className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:max-w-xs">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </section>

          {/* Localização Geográfica */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                3
              </span>
              Localização Geográfica
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="latitude"
                >
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="text"
                  name="latitude"
                  inputMode="decimal"
                  placeholder="Ex: -23.9618"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="longitude"
                >
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="text"
                  name="longitude"
                  inputMode="decimal"
                  placeholder="Ex: -46.3322"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="endereco"
              >
                Endereço
              </label>
              <textarea
                id="endereco"
                name="endereco"
                placeholder="Endereço completo do ativo"
                value={formData.endereco}
                onChange={handleChange}
                rows={3}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          {/* Informações Operacionais */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                4
              </span>
              Informações Operacionais
            </h3>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="operador"
                >
                  Operador
                </label>
                <input
                  id="operador"
                  type="text"
                  name="operador"
                  placeholder="Ex: Santos Port Authority"
                  value={formData.operador}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2 sm:max-w-xs">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="capacidade"
                >
                  Capacidade/Extensão
                </label>
                <input
                  id="capacidade"
                  type="text"
                  name="capacidade_extensao"
                  placeholder="Ex: 12 milhões de toneladas/ano"
                  value={formData.capacidade_extensao || ""}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2 sm:max-w-sm">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="horario"
                >
                  Horário de Funcionamento
                </label>
                <input
                  id="horario"
                  type="text"
                  name="horario"
                  placeholder="Ex: 24h ou 06:00–22:00"
                  value={formData.horario}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="observacoes"
                >
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais sobre o ativo"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            <span className="text-red-500">*</span> Campos obrigatórios
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[.98]"
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {!params?.id ? "Cadastrar Ativo" : "Atualizar Ativo"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
