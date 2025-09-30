// app/projetos/page.tsx  (Server Component)
import ProjetosTableClient, { ProjetoRow } from "@/components/projectTable";

export default async function Page() {
  const dados: ProjetoRow[] = [
    { id: 1, projeto: "Expansão Porto Santos", modal: "Portos", status: "Em Andamento", responsavel: "Santos Port Authority", investimento: "R$ 150M", prazo: "Dez/2024" },
    { id: 2, projeto: "Modernização Aeroporto Guarulhos", modal: "Aeroportos", status: "Planejamento", responsavel: "GRU Airport", investimento: "R$ 80M", prazo: "Jun/2025" },
    { id: 3, projeto: "Duplicação BR-101 Trecho Sul", modal: "Rodovias", status: "Em Andamento", responsavel: "DNIT", investimento: "R$ 2.5B", prazo: "Mar/2025" },
    { id: 4, projeto: "Ferrovia Norte-Sul Extensão", modal: "Ferrovias", status: "Licitação", responsavel: "VALEC", investimento: "R$ 4.2B", prazo: "Dez/2026" },
    { id: 5, projeto: "Gasoduto Nordeste", modal: "Dutovias", status: "Estudo", responsavel: "Petrobras", investimento: "R$ 1.8B", prazo: "Jun/2027" },
    { id: 6, projeto: "ETE Regional Campinas", modal: "Apoio Econômico", status: "Em Andamento", responsavel: "SANASA", investimento: "R$ 45M", prazo: "Set/2024" },
    { id: 7, projeto: "Subestação Energia Solar", modal: "Apoio Econômico", status: "Concluído", responsavel: "CPFL Energia", investimento: "R$ 120M", prazo: "Concluído" },
    { id: 8, projeto: "Terminal Multimodal Goiás", modal: "Apoio Econômico", status: "Planejamento", responsavel: "VLI Logística", investimento: "R$ 200M", prazo: "Abr/2025" },
  ];

  return <ProjetosTableClient data={dados} />;
}
