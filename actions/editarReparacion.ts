'use server'

import {
	Reparacion,
	ReparacionPayloadActualizacion,
} from '@/respositorios/reparacion'
import { currentUser } from '@clerk/nextjs/server'

export default async function editarReparacion(
	reparacion: Omit<
		ReparacionPayloadActualizacion,
		'idUsuario' | 'fechaDeFinalizacion'
	>
) {
	const user = await currentUser()

	if (!user) return

	const nuevaReparacion = new Reparacion(
		reparacion.idPresupuesto,
		reparacion.observaciones,
		new Date(),
		reparacion.reparado,
		reparacion.irreparable,
		user.id
	)

	await nuevaReparacion.update()
}
