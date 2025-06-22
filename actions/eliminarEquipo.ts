'use server'

import db from '@/db/drizzle'
import { equipos } from '@/db/schema'
import { EquipoPayloadRespuesta } from '@/respositorios/equipo'
import { eq } from 'drizzle-orm'

export default async function eliminarEquipo(equipo: EquipoPayloadRespuesta) {
	await db
		.update(equipos)
		.set({ deleted: true })
		.where(eq(equipos.id, equipo.id))
}
