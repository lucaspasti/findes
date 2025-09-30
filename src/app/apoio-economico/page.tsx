// app/projetos/page.tsx  (Server Component)
import { getAtivosByTipoModal } from "@/actions/assets";
import TypeTable from "@/components/typeTable";

export default async function Page() {
  const result = await getAtivosByTipoModal("apoio-economico");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <TypeTable
      data={data}
      title="Apoio Econômico"
      description="Saneamento, Energia e Logística"
    />
  );
}
