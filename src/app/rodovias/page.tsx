// app/projetos/page.tsx  (Server Component)
import { getAtivosByTipoModal } from "@/actions/assets";
import ExtensionTable from "@/components/extensionTable";

export default async function Page() {
  const result = await getAtivosByTipoModal("rodoviário");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <ExtensionTable
      data={data}
      title="Projetos de Rodovias"
      description="Malha Rodoviária Cadastrada"
    />
  );
}
