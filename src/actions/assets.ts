"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabaseServer";

const formSchema = z.object({
  tipoModal: z.string().min(1),
  nomeAtivo: z.string().min(1),
  estado: z.string().min(1),
  municipio: z.string().min(1),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  operador: z.string().optional().nullable(),
  horario: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  capacidade_extensao: z.string(),
});

export type FormInput = z.infer<typeof formSchema>;

export async function insertAtivo(input: FormInput) {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos", issues: parsed.error.issues };
  }

  const toNum = (v?: string | null) =>
    v && v.trim() !== "" ? Number(v) : null;

  const payload = {
    tipo_modal: parsed.data.tipoModal,
    nome_ativo: parsed.data.nomeAtivo,
    estado: parsed.data.estado,
    municipio: parsed.data.municipio,
    status: parsed.data.status,
    latitude: toNum(parsed.data.latitude),
    longitude: toNum(parsed.data.longitude),
    endereco: parsed.data.endereco || null,
    operador: parsed.data.operador || null,
    horario: parsed.data.horario || null,
    observacoes: parsed.data.observacoes || null,
    capacidade_extensao: parsed.data.capacidade_extensao,
  };

  const supabase = supabaseServer();

  const { error } = await supabase.from("findes_ativos").insert(payload);
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function getAtivosByTipoModal(tipoModal: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("findes_ativos")
    .select("*")
    .eq("tipo_modal", tipoModal);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}
export async function getAllAtivos() {
  const supabase = supabaseServer();

  const { data, error } = await supabase.from("findes_ativos").select("*");

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data };
}

export async function getAtivoById(id: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("findes_ativos")
    .select("*")
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data };
}
