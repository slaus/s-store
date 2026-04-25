import { getProductBySku } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}