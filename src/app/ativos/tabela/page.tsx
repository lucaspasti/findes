"use server";

import { getAllAtivos } from "@/actions/assets";
import AtivosTableClient from "@/components/assetsTable";

export default async function Page() {
  const ativos = await getAllAtivos();
  const dados = ativos.ok ? ativos.data ?? [] : [];

  return <AtivosTableClient data={dados} />;
}
