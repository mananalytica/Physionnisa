import { NextResponse } from "next/server";
import { getServices } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const services = await getServices();
  return NextResponse.json({ services });
}
