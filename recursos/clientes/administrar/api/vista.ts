import { Client } from '@/respositorios/client'
import { NextResponse } from 'next/server'

export function VistaObtenerClientes(clientes: Client[]) {
	return NextResponse.json(clientes)
}

export function VistaCrearCliente(cliente: Client) {
	return NextResponse.json(cliente)
}
