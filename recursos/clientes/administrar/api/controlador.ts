import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import modeloClientes from './modelo'
import { VistaCrearCliente, VistaObtenerClientes } from './vista'

export async function ControladorObtenerClientes() {
	const clientes = await modeloClientes.obtenerTodos()

	return VistaObtenerClientes(clientes)
}

export async function ControladorCrearCliente(request: NextRequest) {
	const body = await request.json()
	const user = await auth()

	try {
		// Valida los datos de la request
		if (!user.userId) throw new Error('Usuario no encontrado')

		// Consulta al modelo
		const cliente = await modeloClientes.crear(user.userId, body)

		// Actualiza la vista
		return VistaCrearCliente(cliente)
	} catch (error) {
		if (error instanceof Error) {
			// Si hay error devuelve respuesta de error con el mensaje
			return NextResponse.json({ message: error.message })
		}
	}
}
