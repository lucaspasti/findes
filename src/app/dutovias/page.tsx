// app/projetos/page.tsx  (Server Component)
import { getAtivosByTipoModal } from "@/actions/assets";
import ExtensionTable from "@/components/extensionTable";

export default async function Page() {
  const result = await getAtivosByTipoModal("dutovia");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <ExtensionTable
      data={data}
      title="Dutovias"
      description="Dutos e Oleodutos Cadastrados"
    />
  );
}
