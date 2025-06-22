'use server'

import { Entrega, EntregaPayloadCarga } from '@/respositorios/entregas'

export default async function agregarEntrega(
	entrega: Omit<EntregaPayloadCarga, 'fecha'>
) {
	const nuevaEntrega = new Entrega(
		new Date(),
		entrega.idMetodoDePago,
		entrega.idReparacion
	)

	await nuevaEntrega.save()
}
