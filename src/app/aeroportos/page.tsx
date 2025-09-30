// app/projetos/page.tsx  (Server Component)
import CapacityTable from "@/components/capacityTable";
import { getAtivosByTipoModal } from "@/actions/assets";

export default async function Page() {
  // Chama função server-side
  const result = await getAtivosByTipoModal("aeroporto");
  const data = result.ok ? result.data ?? [] : [];

  return (
    <CapacityTable
      data={data}
      title="Aeroportos"
      description="Infraestruturas Aeroportuárias Cadastradas"
    />
  );
}
