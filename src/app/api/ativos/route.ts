import { getAllAtivos, insertAtivo } from "@/actions/assets";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await insertAtivo(body);

    if (!result.ok) {
      console.error("Erro ao inserir ativo:", result.error);
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Erro no handler:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await getAllAtivos();

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Erro no handler:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}
