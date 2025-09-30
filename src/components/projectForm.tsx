"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type ProjetoFields = {
  // Informações Básicas
  nomeProjeto: string;
  modalTransporte: string;
  statusProjeto:
    | "Estudo"
    | "Planejamento"
    | "Execução"
    | "Concluído"
    | "Suspenso";
  descricaoProjeto: string;

  // Responsáveis e Gestão
  orgaoResponsavel: string;
  gerenteProjeto: string;
  empresaExecutora: string;
  consultoria: string;

  // Cronograma
  dataInicio: string; // dd/mm/aaaa
  dataTermino: string; // dd/mm/aaaa
  duracaoMeses: string;

  // Informações Financeiras
  investimentoTotal: string; // R$
  valorExecutado: string; // R$
  fonteGovFederal: string; // %
  fonteIniciativaPriv: string; // %
  fonteGovEstadual: string; // %

  // Localização
  estadosEnvolvidos: string;
  municipiosPrincipais: string;
  latitudeCentral: string;
  longitudeCentral: string;

  // Situação de Licenciamento
  licencaAmbiental: "Não Requerida" | "Em Análise" | "Aprovada" | "Negada";
  autorizacaoAgencia: "Não Requerida" | "Em Análise" | "Aprovada" | "Negada";
  alvaraMunicipal: "Não Requerido" | "Em Análise" | "Aprovado" | "Negado";
  outrasLicencas: string;

  // Impactos e Benefícios
  empregosGerados: string;
  aumentoCapacidade: string; // %
  beneficiosSocioambientais: string;
};

export default function FormProjeto({
  prevData,
}: {
  prevData?: Partial<ProjetoFields>;
}) {
  const [formData, setFormData] = useState<ProjetoFields>({
    // Básicas
    nomeProjeto: prevData?.nomeProjeto || "",
    modalTransporte: prevData?.modalTransporte || "",
    statusProjeto:
      (prevData?.statusProjeto as ProjetoFields["statusProjeto"]) || "Estudo",
    descricaoProjeto: prevData?.descricaoProjeto || "",

    // Responsáveis
    orgaoResponsavel: prevData?.orgaoResponsavel || "",
    gerenteProjeto: prevData?.gerenteProjeto || "",
    empresaExecutora: prevData?.empresaExecutora || "",
    consultoria: prevData?.consultoria || "",

    // Cronograma
    dataInicio: prevData?.dataInicio || "",
    dataTermino: prevData?.dataTermino || "",
    duracaoMeses: prevData?.duracaoMeses || "",

    // Financeiras
    investimentoTotal: prevData?.investimentoTotal || "",
    valorExecutado: prevData?.valorExecutado || "",
    fonteGovFederal: prevData?.fonteGovFederal || "",
    fonteIniciativaPriv: prevData?.fonteIniciativaPriv || "",
    fonteGovEstadual: prevData?.fonteGovEstadual || "",

    // Localização
    estadosEnvolvidos: prevData?.estadosEnvolvidos || "",
    municipiosPrincipais: prevData?.municipiosPrincipais || "",
    latitudeCentral: prevData?.latitudeCentral || "",
    longitudeCentral: prevData?.longitudeCentral || "",

    // Licenciamento
    licencaAmbiental:
      (prevData?.licencaAmbiental as ProjetoFields["licencaAmbiental"]) ||
      "Não Requerida",
    autorizacaoAgencia:
      (prevData?.autorizacaoAgencia as ProjetoFields["autorizacaoAgencia"]) ||
      "Não Requerida",
    alvaraMunicipal:
      (prevData?.alvaraMunicipal as ProjetoFields["alvaraMunicipal"]) ||
      "Não Requerido",
    outrasLicencas: prevData?.outrasLicencas || "",

    // Impactos
    empregosGerados: prevData?.empregosGerados || "",
    aumentoCapacidade: prevData?.aumentoCapacidade || "",
    beneficiosSocioambientais: prevData?.beneficiosSocioambientais || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Projeto enviado:", formData);
    setTimeout(() => setIsSubmitting(false), 600);
  }

  function handleClear() {
    setFormData({
      nomeProjeto: "",
      modalTransporte: "",
      statusProjeto: "Estudo",
      descricaoProjeto: "",
      orgaoResponsavel: "",
      gerenteProjeto: "",
      empresaExecutora: "",
      consultoria: "",
      dataInicio: "",
      dataTermino: "",
      duracaoMeses: "",
      investimentoTotal: "",
      valorExecutado: "",
      fonteGovFederal: "",
      fonteIniciativaPriv: "",
      fonteGovEstadual: "",
      estadosEnvolvidos: "",
      municipiosPrincipais: "",
      latitudeCentral: "",
      longitudeCentral: "",
      licencaAmbiental: "Não Requerida",
      autorizacaoAgencia: "Não Requerida",
      alvaraMunicipal: "Não Requerido",
      outrasLicencas: "",
      empregosGerados: "",
      aumentoCapacidade: "",
      beneficiosSocioambientais: "",
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
                  name="nomeProjeto"
                  type="text"
                  placeholder="Ex: Expansão Porto Santos"
                  required
                  value={formData.nomeProjeto}
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
                    name="modalTransporte"
                    value={formData.modalTransporte}
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
                    name="statusProjeto"
                    value={formData.statusProjeto}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Estudo">Estudo</option>
                    <option value="Planejamento">Planejamento</option>
                    <option value="Execução">Em Execução</option>
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
                  name="descricaoProjeto"
                  rows={4}
                  placeholder="Descreva os objetivos e escopo do projeto"
                  value={formData.descricaoProjeto}
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
                  name="orgaoResponsavel"
                  type="text"
                  placeholder="Ex: DNIT, ANTT, Santos Port Authority"
                  value={formData.orgaoResponsavel}
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
                  name="gerenteProjeto"
                  type="text"
                  placeholder="Nome do gerente responsável"
                  value={formData.gerenteProjeto}
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
                  name="empresaExecutora"
                  type="text"
                  placeholder="Empresa responsável pela execução"
                  value={formData.empresaExecutora}
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
                  name="dataInicio"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  inputMode="numeric"
                  pattern="\d{2}/\d{2}/\d{4}"
                  value={formData.dataInicio}
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
                  name="dataTermino"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  inputMode="numeric"
                  pattern="\d{2}/\d{2}/\d{4}"
                  value={formData.dataTermino}
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
                  name="duracaoMeses"
                  type="text"
                  placeholder="Ex: 24"
                  inputMode="numeric"
                  pattern="\d*"
                  value={formData.duracaoMeses}
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
                  name="investimentoTotal"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 150000000"
                  value={formData.investimentoTotal}
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
                  name="valorExecutado"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 52500000"
                  value={formData.valorExecutado}
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
                  name="fonteGovFederal"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 60"
                  pattern="\d*"
                  value={formData.fonteGovFederal}
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
                  name="fonteIniciativaPriv"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 30"
                  pattern="\d*"
                  value={formData.fonteIniciativaPriv}
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
                  name="fonteGovEstadual"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 10"
                  pattern="\d*"
                  value={formData.fonteGovEstadual}
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
                  name="estadosEnvolvidos"
                  type="text"
                  placeholder="Ex: SP, RJ, MG"
                  value={formData.estadosEnvolvidos}
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
                  name="municipiosPrincipais"
                  type="text"
                  placeholder="Ex: Santos, São Paulo, Campinas"
                  value={formData.municipiosPrincipais}
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
                    name="latitudeCentral"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: -23.9618"
                    value={formData.latitudeCentral}
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
                    name="longitudeCentral"
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: -46.3332"
                    value={formData.longitudeCentral}
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
                  name="licencaAmbiental"
                  value={formData.licencaAmbiental}
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
                  name="autorizacaoAgencia"
                  value={formData.autorizacaoAgencia}
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
                  name="alvaraMunicipal"
                  value={formData.alvaraMunicipal}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 p-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Não Requerido">Não Requerido</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Negado">Negado</option>
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
                  name="outrasLicencas"
                  type="text"
                  placeholder="Especifique outras licenças necessárias"
                  value={formData.outrasLicencas}
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
                  name="empregosGerados"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="Ex: 2500"
                  value={formData.empregosGerados}
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
                  name="aumentoCapacidade"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="Ex: 35"
                  value={formData.aumentoCapacidade}
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
                name="beneficiosSocioambientais"
                rows={4}
                placeholder="Descreva os principais benefícios sociais e ambientais esperados"
                value={formData.beneficiosSocioambientais}
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
