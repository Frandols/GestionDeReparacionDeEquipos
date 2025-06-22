'use server'

import Equipo from '@/recursos/equipos/modelo'
import { ReparacionPayloadCreacion } from '@/respositorios/reparacion'

export default async function iniciarReparacion(
	reparacion: Omit<ReparacionPayloadCreacion, 'idUsuario'>
) {
	await Equipo.iniciarReparacion(reparacion)
}
