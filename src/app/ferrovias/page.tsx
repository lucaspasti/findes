// app/projetos/page.tsx  (Server Component)
import { getAtivosByTipoModal } from "@/actions/assets";
import ExtensionTable from "@/components/extensionTable";

export default async function Page() {
  const result = await getAtivosByTipoModal("apoio-economico");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <ExtensionTable
      data={data}
      title="Projetos de Ferrovias"
      description="Lista de projetos relacionados a ferrovias"
    />
  );
}
