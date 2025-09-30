"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabaseServer";

/** Helpers de normalização */
const stripNotNumber = (s?: string | null) =>
  s ? s.replace(/[^\d,-.]/g, "") : "";

const toNumber = (s?: string | null) => {
  if (!s) return null;
  const raw = stripNotNumber(s).replace(/\./g, "").replace(",", ".");
  if (raw === "" || isNaN(Number(raw))) return null;
  return Number(raw);
};

const toInt = (s?: string | null) => {
  if (!s) return null;
  const n = Number(stripNotNumber(s).replace(",", "."));
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

const toPercent = (s?: string | null) => {
  const n = toNumber(s);
  return n === null ? null : n; // guarda como 0–100
};

const toCurrency = (s?: string | null) => {
  const n = toNumber(s);
  return n === null ? null : n; // guarda em R$ como número (não em centavos)
};

const parseBRDateToISODate = (s?: string | null) => {
  if (!s) return null;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const [_, dd, mm, yyyy] = m;
  const d = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

/** Schema do formulário (lado servidor) */
const projetoSchema = z.object({
  // Informações Básicas
  nome_projeto: z.string().min(1),
  modal_transporte: z.string().min(1),
  status_projeto: z.enum([
    "Estudo",
    "Planejamento",
    "Execução",
    "Concluído",
    "Suspenso",
  ]),
  descricao_projeto: z.string().optional().default(""),

  // Responsáveis e Gestão
  orgao_responsavel: z.string().optional().default(""),
  gerente_projeto: z.string().optional().default(""),
  empresa_executora: z.string().optional().default(""),
  consultoria: z.string().optional().default(""),

  // Cronograma
  data_inicio: z.string().optional().nullable(),
  data_termino: z.string().optional().nullable(),
  duracao_meses: z.string().optional().default(""),

  // Financeiras
  investimento_total: z.string().optional().default(""),
  valor_executado: z.string().optional().default(""),
  fonte_gov_federal: z.string().optional().default(""),
  fonte_iniciativa_priv: z.string().optional().default(""),
  fonte_gov_estadual: z.string().optional().default(""),

  // Localização
  estados_envolvidos: z.string().optional().default(""),
  municipios_principais: z.string().optional().default(""),
  latitude_central: z.string().optional().default(""),
  longitude_central: z.string().optional().default(""),

  // Licenças
  licenca_ambiental: z.enum([
    "Não Requerida",
    "Em Análise",
    "Aprovada",
    "Negada",
  ]),
  autorizacao_agencia: z.enum([
    "Não Requerida",
    "Em Análise",
    "Aprovada",
    "Negada",
  ]),
  alvara_municipal: z.enum([
    "Não Requerido",
    "Em Análise",
    "Aprovada",
    "Negada",
  ]),
  outras_licencas: z.string().optional().default(""),

  // Impactos
  empregos_gerados: z.string().optional().default(""),
  aumento_capacidade: z.string().optional().default(""),
  beneficios_socioambientais: z.string().optional().default(""),
});

export type ProjetoInput = z.infer<typeof projetoSchema>;

export async function insertProjeto(input: ProjetoInput) {
  const parsed = projetoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos", issues: parsed.error.issues };
  }

  const data = parsed.data;

  // Regras de negócio simples (ex.: soma de fontes <= 100)
  const pFed = toPercent(data.fonte_gov_estadual) ?? 0;
  const pPriv = toPercent(data.fonte_iniciativa_priv) ?? 0;
  const pEst = toPercent(data.fonte_gov_estadual) ?? 0;
  if (pFed + pPriv + pEst > 100.0001) {
    return {
      ok: false,
      error: "A soma das fontes de financiamento não pode exceder 100%.",
    };
  }

  const payload = {
    // snake_case para o banco
    nome_projeto: data.nome_projeto,
    modal_transporte: data.modal_transporte,
    status_projeto: data.status_projeto,
    descricao_projeto: data.descricao_projeto || null,

    orgao_responsavel: data.orgao_responsavel || null,
    gerente_projeto: data.gerente_projeto || null,
    empresa_executora: data.empresa_executora || null,
    consultoria: data.consultoria || null,

    data_inicio: parseBRDateToISODate(data.data_inicio),
    data_termino: parseBRDateToISODate(data.data_termino),
    duracao_meses: toInt(data.duracao_meses),

    investimento_total: toCurrency(data.investimento_total),
    valor_executado: toCurrency(data.valor_executado),
    fonte_gov_federal: toPercent(data.fonte_gov_federal),
    fonte_iniciativa_priv: toPercent(data.fonte_iniciativa_priv),
    fonte_gov_estadual: toPercent(data.fonte_gov_estadual),

    estados_envolvidos: data.estados_envolvidos || null,
    municipios_principais: data.municipios_principais || null,
    latitude_central: toNumber(data.latitude_central),
    longitude_central: toNumber(data.longitude_central),

    licenca_ambiental: data.licenca_ambiental,
    autorizacao_agencia: data.autorizacao_agencia,
    alvara_municipal: data.alvara_municipal,
    outras_licencas: data.outras_licencas || null,

    empregos_gerados: toInt(data.empregos_gerados),
    aumento_capacidade: toPercent(data.aumento_capacidade),
    beneficios_socioambientais: data.beneficios_socioambientais || null,
  };

  const supabase = supabaseServer();

  // ajuste o nome da tabela conforme seu schema
  const { data: inserted, error } = await supabase
    .from("findes_projetos")
    .upsert(payload)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: inserted?.id };
}

export async function getAllProjetos() {
  const supabase = supabaseServer();

  const { data, error } = await supabase.from("findes_projetos").select("*");

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}

export async function getProjectById(id: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("findes_projetos")
    .select("*")
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}
