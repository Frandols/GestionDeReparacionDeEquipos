'use server'

import Equipo from '@/recursos/equipos/modelo'

export default async function iniciarRevision(idEquipo: number) {
	await Equipo.iniciarRevision(idEquipo)
}
