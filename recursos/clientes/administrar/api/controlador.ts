import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Cliente from '../../modelo'
import { VistaCrearCliente, VistaObtenerClientes } from './vista'

export async function ControladorObtenerClientes() {
	const clientes = await Cliente.obtenerClientes()

	return VistaObtenerClientes(clientes)
}

export async function ControladorCrearCliente(request: NextRequest) {
	const body = await request.json()
	const user = await auth()

	try {
		// Valida los datos de la request
		if (!user.userId) throw new Error('Usuario no encontrado')

		const esValido = Cliente.verificarCliente(body)

		if (!esValido) throw new Error('Los datos del cliente no son validos')

		// Consulta al modelo
		const cliente = await Cliente.registrarCliente(user.userId, body)

		// Actualiza la vista
		return VistaCrearCliente(cliente)
	} catch (error) {
		if (error instanceof Error) {
			// Si hay error devuelve respuesta de error con el mensaje
			return NextResponse.json({ message: error.message }, { status: 400 })
		}
	}
}
