'use server'

import {
	Reparacion,
	ReparacionPayloadCreacion,
} from '@/respositorios/reparacion'
import { currentUser } from '@clerk/nextjs/server'

export default async function iniciarReparacion(
	reparacion: Omit<ReparacionPayloadCreacion, 'idUsuario'>
) {
	const user = await currentUser()

	if (!user) return

	const nuevaReparacion = new Reparacion(
		reparacion.idPresupuesto,
		null,
		null,
		null,
		false,
		user.id
	)

	await nuevaReparacion.save()
}
