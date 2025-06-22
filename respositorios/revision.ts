import db from '@/db/drizzle'
import { revisiones } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type RevisionPayloadRespuesta = Omit<
	Revision,
	'save' | 'getAll' | 'update'
>

export class Revision {
	idEquipo: number
	observaciones: string | null
	fechaDeFinalizacion: Date | null

	constructor(
		idEquipo: number,
		observaciones: string | null,
		fechaDeFinalizacion: Date | null
	) {
		this.idEquipo = idEquipo
		this.observaciones = observaciones
		this.fechaDeFinalizacion = fechaDeFinalizacion
	}

	async save() {
		await db.insert(revisiones).values({
			idEquipo: this.idEquipo,
			observaciones: this.observaciones,
			fechaDeFinalizacion: this.fechaDeFinalizacion,
		})

		return this
	}

	async update() {
		await db
			.update(revisiones)
			.set({
				observaciones: this.observaciones,
				fechaDeFinalizacion: this.fechaDeFinalizacion,
			})
			.where(eq(revisiones.idEquipo, this.idEquipo))
	}
}
