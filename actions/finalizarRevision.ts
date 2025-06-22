'use server'

import Equipo from '@/recursos/equipos/modelo'

export default async function finalizarRevision(
	idEquipo: number,
	observaciones: string
) {
	Equipo.finalizarRevision(idEquipo, observaciones)
}
