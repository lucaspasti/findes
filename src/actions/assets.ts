"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabaseServer";

// schema em snake_case para bater com o body do formulário
const formSchema = z.object({
  id: z.string().optional(), // <- precisa de () em optional
  tipo_modal: z.string().min(1, "tipo_modal é obrigatório"),
  nome_ativo: z.string().min(1, "nome_ativo é obrigatório"),
  estado: z.string().min(1, "estado é obrigatório"),
  municipio: z.string().min(1, "municipio é obrigatório"),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),

  // strings vindas do form; convertemos para number | null
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

  endereco: z.string().optional().nullable(),
  operador: z.string().optional().nullable(),
  horario: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),

  capacidade_extensao: z.string().min(1, "capacidade_extensao é obrigatória"),
});

export type FormInput = z.infer<typeof formSchema>;

export async function insertAtivo(input: unknown) {
  const parsed = formSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues };
  }

  const data = parsed.data;

  // payload exatamente com as colunas do Supabase (snake_case)
  const payload = {
    // id só é usado no WHERE quando atualizar
    tipo_modal: data.tipo_modal,
    nome_ativo: data.nome_ativo,
    estado: data.estado,
    municipio: data.municipio,
    status: data.status,
    latitude: data.latitude, // number | null
    longitude: data.longitude, // number | null
    endereco: data.endereco ?? null,
    operador: data.operador ?? null,
    horario: data.horario ?? null,
    observacoes: data.observacoes ?? null,
    capacidade_extensao: data.capacidade_extensao,
  };

  const supabase = supabaseServer();

  if (data.id) {
    // Atualização — não tente atualizar a coluna id
    const { error } = await supabase
      .from("findes_ativos")
      .update(payload)
      .eq("id", data.id);

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data.id };
  } else {
    // Inserção — peça para retornar o id
    const { data: inserted, error } = await supabase
      .from("findes_ativos")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: inserted?.id };
  }
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
