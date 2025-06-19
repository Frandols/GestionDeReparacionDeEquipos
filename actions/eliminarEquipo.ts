'use server'

import db from '@/db/drizzle'
import { equipos } from '@/db/schema'
import { EquipoAdaptado } from '@/respositorios/equipo'
import { eq } from 'drizzle-orm'

export default async function eliminarEquipo(equipo: EquipoAdaptado) {
	await db
		.update(equipos)
		.set({ deleted: true })
		.where(eq(equipos.id, equipo.id))
}
