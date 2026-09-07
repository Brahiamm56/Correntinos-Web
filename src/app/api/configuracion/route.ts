import { NextResponse } from "next/server";
import { getPublicConfiguration } from "@/lib/configuracion";

export async function GET() {
  return NextResponse.json(await getPublicConfiguration());
}
