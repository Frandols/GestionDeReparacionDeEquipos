'use server'

import Equipo from '@/recursos/equipos/modelo'
import { EquipoPayloadActualizacion } from '@/respositorios/equipo'

export default async function editarEquipo(
	id: number,
	actualizacion: EquipoPayloadActualizacion
) {
	const esValido = Equipo.verificarDatosEquipo(actualizacion)

	if (!esValido) throw new Error('Los datos no son validos')

	return await Equipo.actualizarEquipo(id, actualizacion)
}
