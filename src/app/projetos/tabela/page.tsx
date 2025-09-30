// app/projetos/page.tsx  (Server Component)
import { getAllProjetos } from "@/actions/projects";
import ProjetosTableClient from "@/components/projectTable";

export default async function Page() {
  const projetos = await getAllProjetos();
  const dados = projetos.ok ? projetos.data ?? [] : [];

  return <ProjetosTableClient data={dados} />;
}
