import { Client } from '@/modelos/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: { dni: string } }
) {
	const { dni } = params

	if (!dni) {
		return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
	}

	const client = await Client.getByDni(dni)

	if (!client) {
		return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
	}

	return NextResponse.json(client)
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { dni: string } }
) {
	const { dni } = params

	if (!dni) {
		return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
	}

	const client = await Client.getByDni(dni)

	if (!client) {
		return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
	}

	try {
		const success = await Client.deleteByDni(dni)

		if (success) {
			return NextResponse.json({ message: 'Cliente marcado como eliminado con éxito' }, { status: 200 })
		} else {
			return NextResponse.json({ error: 'No se pudo realizar la baja lógica del cliente' }, { status: 500 })
		}
	} catch (error) {
		console.error('Error al marcar el cliente como eliminado:', error)
		return NextResponse.json({ error: 'Hubo un problema al marcar el cliente como eliminado' }, { status: 500 })
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { dni: string } }
) {
	const { dni } = params

	if (!dni) {
		return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
	}

	const client = await Client.getByDni(dni)

	if (!client) {
		return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
	}

	try {
		const success = await Client.restoreByDni(dni)

		if (success) {
			return NextResponse.json({ message: 'Cliente restaurado con éxito' }, { status: 200 })
		} else {
			return NextResponse.json({ error: 'No se pudo restaurar el cliente' }, { status: 500 })
		}
	} catch (error) {
		console.error('Error al restaurar cliente:', error)
		return NextResponse.json({ error: 'Hubo un problema al restaurar el cliente' }, { status: 500 })
	}
}


export async function PUT(
	request: NextRequest,
	{ params }: { params: { dni: string } }
) {
	const { dni } = params
	const data = await request.json()

	if (!dni) {
		return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
	}

	const client = await Client.getByDni(dni)

	if (!client) {
		return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
	}

	try {
		const success = await Client.updateByDni(dni, data)

		if (success) {
			return NextResponse.json({ message: 'Cliente actualizado con éxito' }, { status: 200 })
		} else {
			return NextResponse.json({ error: 'No se pudo actualizar el cliente' }, { status: 500 })
		}
	} catch (error) {
		console.error('Error al actualizar cliente:', error)
		return NextResponse.json({ error: 'Hubo un problema al actualizar el cliente' }, { status: 500 })
	}
}
