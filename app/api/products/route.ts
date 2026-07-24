import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
