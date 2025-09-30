"use client";

import { insertProjeto } from "@/actions/projects";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

type ProjetoFields = {
  // Informações Básicas
  nome_projeto: string;
  modal_transporte: string;
  status_projeto:
    | "Estudo"
    | "Planejamento"
    | "Execução"
    | "Concluído"
    | "Suspenso";
  descricao_projeto: string;

  // Responsáveis e Gestão
  orgao_responsavel: string;
  gerente_projeto: string;
  empresa_executora: string;
  consultoria: string;

  // Cronograma
  data_inicio: string; // dd/mm/aaaa
  data_termino: string; // dd/mm/aaaa
  duracao_meses: string;

  // Informações Financeiras
  investimento_total: string; // R$
  valor_executado: string; // R$
  fonte_gov_federal: string; // %
  fonte_iniciativa_priv: string; // %
  fonte_gov_estadual: string; // %

  // Localização
  estados_envolvidos: string;
  municipios_principais: string;
  latitude_central: string;
  longitude_central: string;

  // Situação de Licenciamento
  licenca_ambiental: "Não Requerida" | "Em Análise" | "Aprovada" | "Negada";
  autorizacao_agencia: "Não Requerida" | "Em Análise" | "Aprovada" | "Negada";
  alvara_municipal: "Não Requerido" | "Em Análise" | "Aprovada" | "Negada";
  outras_licencas: string;

  // Impactos e Benefícios
  empregos_gerados: string;
  aumento_capacidade: string; // %
  beneficios_socioambientais: string;
};

export default function FormProjeto({
  prevData,
}: {
  prevData?: Partial<ProjetoFields>;
}) {
  const [formData, setFormData] = useState<ProjetoFields>({
    // Básicas
    nome_projeto: prevData?.nome_projeto || "",
    modal_transporte: prevData?.modal_transporte || "",
    status_projeto:
      (prevData?.status_projeto as ProjetoFields["status_projeto"]) || "Estudo",
    descricao_projeto: prevData?.descricao_projeto || "",

    // Responsáveis
    orgao_responsavel: prevData?.orgao_responsavel || "",
    gerente_projeto: prevData?.gerente_projeto || "",
    empresa_executora: prevData?.empresa_executora || "",
    consultoria: prevData?.consultoria || "",

    // Cronograma
    data_inicio: prevData?.data_inicio || "",
    data_termino: prevData?.data_termino || "",
    duracao_meses: prevData?.duracao_meses || "",

    // Financeiras
    investimento_total: prevData?.investimento_total || "",
    valor_executado: prevData?.valor_executado || "",
    fonte_gov_federal: prevData?.fonte_gov_federal || "",
    fonte_iniciativa_priv: prevData?.fonte_iniciativa_priv || "",
    fonte_gov_estadual: prevData?.fonte_gov_estadual || "",

    // Localização
    estados_envolvidos: prevData?.estados_envolvidos || "",
    municipios_principais: prevData?.municipios_principais || "",
    latitude_central: prevData?.latitude_central || "",
    longitude_central: prevData?.longitude_central || "",

    // Licenciamento
    licenca_ambiental:
      (prevData?.licenca_ambiental as ProjetoFields["licenca_ambiental"]) ||
      "Não Requerida",
    autorizacao_agencia:
      (prevData?.autorizacao_agencia as ProjetoFields["autorizacao_agencia"]) ||
      "Não Requerida",
    alvara_municipal:
      (prevData?.alvara_municipal as ProjetoFields["alvara_municipal"]) ||
      "Não Requerido",
    outras_licencas: prevData?.outras_licencas || "",

    // Impactos
    empregos_gerados: prevData?.empregos_gerados || "",
    aumento_capacidade: prevData?.aumento_capacidade || "",
    beneficios_socioambientais: prevData?.beneficios_socioambientais || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await insertProjeto(formData);

      if (result.ok) {
        console.log("Projeto inserido com ID:", result.id);
        handleClear();
        toast("Projeto inserido com sucesso!");
      } else {
        console.error("Erro:", result.error, result.issues);
        alert(result.error ?? "Falha ao salvar o projeto");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado ao salvar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClear() {
    setFormData({
      nome_projeto: "",
      modal_transporte: "",
      status_projeto: "Estudo",
      descricao_projeto: "",
      orgao_responsavel: "",
      gerente_projeto: "",
      empresa_executora: "",
      consultoria: "",
      data_inicio: "",
      data_termino: "",
      duracao_meses: "",
      investimento_total: "",
      valor_executado: "",
      fonte_gov_federal: "",
      fonte_iniciativa_priv: "",
      fonte_gov_estadual: "",
      estados_envolvidos: "",
      municipios_principais: "",
      latitude_central: "",
      longitude_central: "",
      licenca_ambiental: "Não Requerida",
      autorizacao_agencia: "Não Requerida",
      alvara_municipal: "Não Requerido",
      outras_licencas: "",
      empregos_gerados: "",
      aumento_capacidade: "",
      beneficios_socioambientais: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 sm:p-8"
      aria-labelledby="form-title"
    >
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
        {/* Header */}
        <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          <h2
            id="form-title"
            className="text-2xl font-semibold tracking-tight text-slate-800"
          >
            Cadastrar Novo Projeto
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados para adicionar um novo projeto de infraestrutura.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="grid gap-6 p-5 sm:p-6">
          {/* Informações Básicas */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                1
              </span>
              Informações Básicas
            </h3>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="nomeProjeto"
                  className="text-sm font-medium text-slate-700"
                >
                  Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomeProjeto"
                  name="nome_projeto"
                  type="text"
                  placeholder="Ex: Expansão Porto Santos"
                  required
                  value={formData.nome_projeto}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="modalTransporte"
                    className="text-sm font-medium text-slate-700"
                  >
                    Modal de Transporte
                  </label>
                  <select
                    id="modalTransporte"
                    name="modal_transporte"
                    value={formData.modal_transporte}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecione o modal</option>
                    <option value="porto">Porto</option>
                    <option value="aeroporto">Aeroporto</option>
                    <option value="rodovia">Rodovia</option>
                    <option value="ferrovia">Ferrovia</option>
                    <option value="dutovia">Dutovia</option>
                    <option value="hidrovia">Hidrovia</option>
                    <option value="apoio-economico">Apoio Econômico</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="statusProjeto"
                    className="text-sm font-medium text-slate-700"
                  >
                    Status do Projeto
                  </label>
                  <select
                    id="statusProjeto"
                    name="status_projeto"
                    value={formData.status_projeto}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Estudo">Estudo</option>
                    <option value="Planejamento">Planejamento</option>
                    <option value="Execução">Execução</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Suspenso">Suspenso</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="descricaoProjeto"
                  className="text-sm font-medium text-slate-700"
                >
                  Descrição do Projeto
                </label>
                <textarea
                  id="descricaoProjeto"
                  name="descricao_projeto"
                  rows={4}
                  placeholder="Descreva os objetivos e escopo do projeto"
                  value={formData.descricao_projeto}
                  onChange={handleChange}
                  className="w-full resize-y rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Responsáveis e Gestão */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                2
              </span>
              Responsáveis e Gestão
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label
                  htmlFor="orgaoResponsavel"
                  className="text-sm font-medium text-slate-700"
                >
                  Órgão Responsável
                </label>
                <input
                  id="orgaoResponsavel"
                  name="orgao_responsavel"
                  type="text"
                  placeholder="Ex: DNIT, ANTT, Santos Port Authority"
                  value={formData.orgao_responsavel}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="gerenteProjeto"
                  className="text-sm font-medium text-slate-700"
                >
                  Gerente do Projeto
                </label>
                <input
                  id="gerenteProjeto"
                  name="gerente_projeto"
                  type="text"
                  placeholder="Nome do gerente responsável"
                  value={formData.gerente_projeto}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="empresaExecutora"
                  className="text-sm font-medium text-slate-700"
                >
                  Empresa Executora
                </label>
                <input
                  id="empresaExecutora"
                  name="empresa_executora"
                  type="text"
                  placeholder="Empresa responsável pela execução"
                  value={formData.empresa_executora}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="consultoria"
                  className="text-sm font-medium text-slate-700"
                >
                  Consultoria
                </label>
                <input
                  id="consultoria"
                  name="consultoria"
                  type="text"
                  placeholder="Empresa de consultoria (se houver)"
                  value={formData.consultoria}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Cronograma */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                3
              </span>
              Cronograma
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label
                  htmlFor="dataInicio"
                  className="text-sm font-medium text-slate-700"
                >
                  Data de Início
                </label>
                <input
                  id="dataInicio"
                  name="data_inicio"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  inputMode="numeric"
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                  value={formData.data_inicio}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="dataTermino"
                  className="text-sm font-medium text-slate-700"
                >
                  Previsão de Término
                </label>
                <input
                  id="dataTermino"
                  name="data_termino"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  inputMode="numeric"
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                  value={formData.data_termino}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="duracaoMeses"
                  className="text-sm font-medium text-slate-700"
                >
                  Duração (meses)
                </label>
                <input
                  id="duracaoMeses"
                  name="duracao_meses"
                  type="text"
                  placeholder="Ex: 24"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.duracao_meses}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Informações Financeiras */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                4
              </span>
              Informações Financeiras
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label
                  htmlFor="investimentoTotal"
                  className="text-sm font-medium text-slate-700"
                >
                  Investimento Total (R$)
                </label>
                <input
                  id="investimentoTotal"
                  name="investimento_total"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 150000000"
                  value={formData.investimento_total}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="valorExecutado"
                  className="text-sm font-medium text-slate-700"
                >
                  Valor Executado (R$)
                </label>
                <input
                  id="valorExecutado"
                  name="valor_executado"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 52500000"
                  value={formData.valor_executado}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label
                  htmlFor="fonteGovFederal"
                  className="text-sm font-medium text-slate-700"
                >
                  Governo Federal (%)
                </label>
                <input
                  id="fonteGovFederal"
                  name="fonte_gov_federal"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 60"
                  pattern="[0-9]*"
                  value={formData.fonte_gov_federal}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="fonteIniciativaPriv"
                  className="text-sm font-medium text-slate-700"
                >
                  Iniciativa Privada (%)
                </label>
                <input
                  id="fonteIniciativaPriv"
                  name="fonte_iniciativa_priv"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 30"
                  pattern="[0-9]*"
                  value={formData.fonte_iniciativa_priv}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="fonteGovEstadual"
                  className="text-sm font-medium text-slate-700"
                >
                  Governo Estadual (%)
                </label>
                <input
                  id="fonteGovEstadual"
                  name="fonte_gov_estadual"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 10"
                  pattern="[0-9]*"
                  value={formData.fonte_gov_estadual}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Localização */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                5
              </span>
              Localização
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="estadosEnvolvidos"
                  className="text-sm font-medium text-slate-700"
                >
                  Estados Envolvidos
                </label>
                <input
                  id="estadosEnvolvidos"
                  name="estados_envolvidos"
                  type="text"
                  placeholder="Ex: SP, RJ, MG"
                  value={formData.estados_envolvidos}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="municipiosPrincipais"
                  className="text-sm font-medium text-slate-700"
                >
                  Municípios Principais
                </label>
                <input
                  id="municipiosPrincipais"
                  name="municipios_principais"
                  type="text"
                  placeholder="Ex: Santos, São Paulo, Campinas"
                  value={formData.municipios_principais}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="latitudeCentral"
                    className="text-sm font-medium text-slate-700"
                  >
                    Latitude Central
                  </label>
                  <input
                    id="latitudeCentral"
                    name="latitude_central"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: -23.9618"
                    value={formData.latitude_central}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="longitudeCentral"
                    className="text-sm font-medium text-slate-700"
                  >
                    Longitude Central
                  </label>
                  <input
                    id="longitudeCentral"
                    name="longitude_central"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: -46.3332"
                    value={formData.longitude_central}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Situação de Licenciamento */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                6
              </span>
              Situação de Licenciamento
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label
                  htmlFor="licencaAmbiental"
                  className="text-sm font-medium text-slate-700"
                >
                  Licença Ambiental
                </label>
                <select
                  id="licencaAmbiental"
                  name="licenca_ambiental"
                  value={formData.licenca_ambiental}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Não Requerida">Não Requerida</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Negada">Negada</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="autorizacaoAgencia"
                  className="text-sm font-medium text-slate-700"
                >
                  Autorização ANTT/ANTAQ
                </label>
                <select
                  id="autorizacaoAgencia"
                  name="autorizacao_agencia"
                  value={formData.autorizacao_agencia}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Não Requerida">Não Requerida</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Negada">Negada</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="alvaraMunicipal"
                  className="text-sm font-medium text-slate-700"
                >
                  Alvará Municipal
                </label>
                <select
                  id="alvaraMunicipal"
                  name="alvara_municipal"
                  value={formData.alvara_municipal}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Não Requerido">Não Requerido</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Negada">Negada</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="outrasLicencas"
                  className="text-sm font-medium text-slate-700"
                >
                  Outras Licenças
                </label>
                <input
                  id="outrasLicencas"
                  name="outras_licencas"
                  type="text"
                  placeholder="Especifique outras licenças necessárias"
                  value={formData.outras_licencas}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Impactos e Benefícios */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-800">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-xs font-semibold text-slate-600">
                7
              </span>
              Impactos e Benefícios Esperados
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label
                  htmlFor="empregosGerados"
                  className="text-sm font-medium text-slate-700"
                >
                  Empregos Gerados
                </label>
                <input
                  id="empregosGerados"
                  name="empregos_gerados"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 2500"
                  value={formData.empregos_gerados}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="aumentoCapacidade"
                  className="text-sm font-medium text-slate-700"
                >
                  Aumento de Capacidade (%)
                </label>
                <input
                  id="aumentoCapacidade"
                  name="aumento_capacidade"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 35"
                  value={formData.aumento_capacidade}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <label
                htmlFor="beneficiosSocioambientais"
                className="text-sm font-medium text-slate-700"
              >
                Benefícios Socioambientais
              </label>
              <textarea
                id="beneficiosSocioambientais"
                name="beneficios_socioambientais"
                rows={4}
                placeholder="Descreva os principais benefícios sociais e ambientais esperados"
                value={formData.beneficios_socioambientais}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar Projeto"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
