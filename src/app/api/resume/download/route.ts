import { NextResponse } from "next/server";
import { SERVER_API_URL } from "@/lib/api/config";

export async function GET(request: Request) {
  // Sem lang o backend gera o PDF em portugues, que e o default certo.
  const lang =
    new URL(request.url).searchParams.get("lang") === "en" ? "en" : "pt";

  const upstream = await fetch(
    `${SERVER_API_URL}/resume/download?lang=${lang}`,
    { cache: "no-store" },
  );

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { message: "Falha ao obter PDF do backend" },
      { status: upstream.status || 502 },
    );
  }

  const headers = new Headers();
  headers.set(
    "content-type",
    upstream.headers.get("content-type") ?? "application/pdf",
  );
  const cd = upstream.headers.get("content-disposition");
  headers.set(
    "content-disposition",
    cd ?? 'attachment; filename="resume.pdf"',
  );
  headers.set("cache-control", "no-store");

  return new NextResponse(upstream.body, { status: 200, headers });
}
