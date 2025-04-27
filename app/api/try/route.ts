import { NextResponse } from "next/server";
import { InferModel } from "drizzle-orm";
import { clientes } from "@/db/schema";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Hello, world!" });
}
