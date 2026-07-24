import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ posts });
}
