import { Client } from "@/modelos/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clients = await Client.getAll(); // await here!
  return NextResponse.json(clients); // Return JSON response
}

export async function POST(request: Request) {
  console.log("POST");
  const body = await request.json();
  console.log(body);
  const client = Client.create(body);
  if (client instanceof Error) {
    return NextResponse.json({ error: client.message }, { status: 400 });
  }
  const result = await client.save();
  if (result.success) {
    return NextResponse.json(client);
  } else {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }
}
