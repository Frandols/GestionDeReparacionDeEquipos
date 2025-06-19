'use server'

import { ActualizacionDeEquipo, Equipo } from '@/respositorios/equipo'

export default async function editarEquipo(
	id: number,
	actualizacion: ActualizacionDeEquipo
) {
	const equipo = new Equipo({ id, ...actualizacion })

	await equipo.update()
}
