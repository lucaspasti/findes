import { NextResponse } from "next/server";
import { getAtivoById } from "@/actions/assets";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  try {
    const { id } = await params; // <= await aqui

    const result = await getAtivoById(id);
    if (!result.ok) {
      return NextResponse.json(result, { status: 500 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Erro no GET handler:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
