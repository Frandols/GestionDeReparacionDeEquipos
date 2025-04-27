import { Client } from '@/modelos/client'
import { NextResponse } from 'next/server'

export async function GET() {
	const clients = await Client.getAll() // await here!

	return NextResponse.json(clients) // Return JSON response
}
