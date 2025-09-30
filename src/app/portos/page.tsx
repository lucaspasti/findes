// app/projetos/page.tsx  (Server Component)
import { getAtivosByTipoModal } from "@/actions/assets";
import CapacityTable from "@/components/capacityTable";

export default async function Page() {
  const result = await getAtivosByTipoModal("porto");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <CapacityTable
      data={data}
      title="Portos"
      description="Infraestruturas Portuárias Cadastradas"
    />
  );
}
