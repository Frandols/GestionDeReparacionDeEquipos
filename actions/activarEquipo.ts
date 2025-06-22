'use server'

import Equipo from '@/recursos/equipos/modelo'
import { EquipoPayloadRespuesta } from '@/respositorios/equipo'

export default async function activarEquipo(equipo: EquipoPayloadRespuesta) {
	await Equipo.activarEquipo(equipo.id)
}
