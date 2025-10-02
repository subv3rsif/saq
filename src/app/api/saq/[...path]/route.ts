import { NextRequest, NextResponse } from "next/server";

async function forward(req: NextRequest, path: string[]) {
  const base = process.env.N8N_BASE!;
  const url = `${base}/${path.join("/")}${req.method === "GET" ? req.nextUrl.search : ""}`;
  const init: RequestInit = {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }
  const r = await fetch(url, init);
  const text = await r.text();
  return new NextResponse(text, { status: r.status, headers: { "Content-Type": "application/json" } });
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
