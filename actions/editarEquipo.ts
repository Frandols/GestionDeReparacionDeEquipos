'use server'

import { Equipo, EquipoPayloadActualizacion } from '@/respositorios/equipo'

export default async function editarEquipo(
	id: number,
	actualizacion: EquipoPayloadActualizacion
) {
	const equipo = new Equipo({ id, ...actualizacion })

	await equipo.update()
}
