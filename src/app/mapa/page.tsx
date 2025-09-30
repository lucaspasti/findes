// app/page.tsx
"use client";
import dynamic from "next/dynamic";

const MultiLayersMap = dynamic(() => import("@/components/rodoviaMap"), {
  ssr: false,
  loading: () => <p>Carregando mapa…</p>,
});

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Mapa com múltiplos layers</h1>
      <MultiLayersMap />
    </main>
  );
}
