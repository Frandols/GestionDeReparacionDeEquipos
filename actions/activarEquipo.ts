'use server'

import db from '@/db/drizzle'
import { equipos } from '@/db/schema'
import { EquipoPayloadRespuesta } from '@/respositorios/equipo'
import { eq } from 'drizzle-orm'

export default async function activarEquipo(equipo: EquipoPayloadRespuesta) {
	await db
		.update(equipos)
		.set({ deleted: false })
		.where(eq(equipos.id, equipo.id))
}
