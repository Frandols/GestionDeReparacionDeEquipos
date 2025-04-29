import { Client } from '@/respositorios/client'
import { NextResponse } from 'next/server'

export function VistaObtenerCliente(cliente: Client) {
	return NextResponse.json(cliente)
}

export function VistaEliminarCliente() {
	return NextResponse.json(
		{ message: 'Cliente marcado como eliminado con éxito' },
		{ status: 200 }
	)
}

export function VistaRestaurarCliente() {
	return NextResponse.json(
		{ message: 'Cliente restaurado con éxito' },
		{ status: 200 }
	)
}

export function VistaModificarCliente() {
	return NextResponse.json(
		{ message: 'Cliente actualizado con éxito' },
		{ status: 200 }
	)
}
