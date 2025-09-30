// app/ativos/editar/[id]/page.tsx
import FormAtivo from "@/components/assetForm";
import { getAtivoById } from "@/actions/assets";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // evita pre-render estático
export const revalidate = 0; // sem cache estático

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const result = await getAtivoById(id);

  if (!result?.ok) notFound();
  const row = result.data?.[0];
  if (!row) notFound();

  return <FormAtivo prevData={row} />;
}
