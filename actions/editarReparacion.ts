'use server'

import Equipo from '@/recursos/equipos/modelo'
import { ReparacionPayloadActualizacion } from '@/respositorios/reparacion'

export default async function editarReparacion(
	reparacion: Omit<
		ReparacionPayloadActualizacion,
		'idUsuario' | 'fechaDeFinalizacion'
	>
) {
	await Equipo.finalizarReparacion(reparacion)
}
