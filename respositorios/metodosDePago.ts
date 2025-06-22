import db from '@/db/drizzle'
import { metodosDePago } from '@/db/schema'

export type MetodoDePagoPayloadRespuesta = Omit<
	MetodoDePago,
	'save' | 'getAll'
> &
	Required<Pick<MetodoDePago, 'id'>>

export class MetodoDePago {
	id?: number
	nombre: string

	constructor(descripcion: string, id?: number) {
		this.nombre = descripcion
		if (id) this.id = id
	}

	async save() {
		if (!this.nombre.trim()) throw new Error('Descripción requerida')
		const result = await db
			.insert(metodosDePago)
			.values({ nombre: this.nombre })
			.returning({ id: metodosDePago.id })
		this.id = result[0].id
		return this
	}

	static async getAll(): Promise<MetodoDePagoPayloadRespuesta[]> {
		const rows = await db.select().from(metodosDePago)
		return rows.map((row) => {
			const modelo = new MetodoDePago(row.nombre, row.id)

			return {
				...modelo,
				id: row.id,
			}
		})
	}
}
