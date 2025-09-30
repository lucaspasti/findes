// app/ativos/editar/[id]/page.tsx
import { getProjectById } from "@/actions/projects";
import { notFound } from "next/navigation";
import FormProjeto from "@/components/projectForm";

export const dynamic = "force-dynamic"; // evita pre-render estático
export const revalidate = 0; // sem cache estático

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const result = await getProjectById(id);

  if (!result?.ok) notFound();
  const row = result.data?.[0];
  if (!row) notFound();

  return <FormProjeto prevData={row} />;
}
