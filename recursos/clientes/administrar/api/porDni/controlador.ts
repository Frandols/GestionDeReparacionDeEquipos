import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import modeloAdministrarClientes from './modelo'
import {
	VistaEliminarCliente,
	VistaModificarCliente,
	VistaObtenerCliente,
	VistaRestaurarCliente,
} from './vista'

export async function ControladorObtenerCliente(
	_: NextRequest,
	{ params }: { params: Promise<{ dni: string }> }
) {
	// Se extraen los parametros de la request
	const { dni } = await params

	try {
		// Verifica los parametros de la request
		if (!dni) throw new Error('DNI no proporcionado')

		// Consulta al modelo
		const cliente = await modeloAdministrarClientes.obtenerCliente(dni)

		// Actualiza la vista
		return VistaObtenerCliente(cliente)
	} catch (error) {
		if (error instanceof Error) {
			// Si hay error devuelve respuesta de error con el mensaje
			return NextResponse.json({ message: error.message })
		}
	}
}

export async function ControladorEliminarCliente(
	_: NextRequest,
	{ params }: { params: Promise<{ dni: string }> }
) {
	// Se extraen los parametros de la request
	const { dni } = await params
	const user = await auth()

	try {
		// Verifica los parametros de la request
		if (!dni) throw new Error('DNI no proporcionado')

		if (!user.userId) throw new Error('Usuario no encontrado')

		// Consulta al modelo
		await modeloAdministrarClientes.eliminarCliente(user.userId, dni)

		// Actualiza la vista
		return VistaEliminarCliente()
	} catch (error) {
		if (error instanceof Error) {
			// Si hay error devuelve respuesta de error con el mensaje
			return NextResponse.json({ message: error.message })
		}
	}
}

export async function ControladorRestaurarCliente(
	_: NextRequest,
	{ params }: { params: Promise<{ dni: string }> }
) {
	// Se extraen los parametros de la request
	const { dni } = await params
	const user = await auth()

	try {
		// Verifica los parametros de la request
		if (!dni) throw new Error('DNI no proporcionado')

		if (!user.userId) throw new Error('Usuario no encontrado')

		// Consulta al modelo
		await modeloAdministrarClientes.restaurarCliente(user.userId, dni)

		// Actualiza la vista
		return VistaRestaurarCliente()
	} catch (error) {
		if (error instanceof Error) {
			// Si hay error devuelve respuesta de error con el mensaje
			return NextResponse.json({ message: error.message })
		}
	}
}

export async function ControladorModificarCliente(
	request: NextRequest,
	{ params }: { params: Promise<{ dni: string }> }
) {
	const { dni } = await params
	const user = await auth()
	const data = await request.json()

	try {
		if (!dni) throw new Error('DNI no proporcionado')
		if (!user.userId) throw new Error('Usuario no encontrado')

		await modeloAdministrarClientes.modificarCliente(user.userId, dni, data)

		return VistaModificarCliente()
	} catch (error) {
		const msg = error instanceof Error ? error.message : 'Error al modificar cliente'
		return NextResponse.json({ message: msg }, { status: 400 })
	}
}
