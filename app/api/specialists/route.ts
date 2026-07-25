import { NextResponse } from "next/server";
import { getSpecialists } from "@/lib/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const specialists = await getSpecialists();
  return NextResponse.json({ specialists });
}
