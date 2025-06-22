import db from '@/db/drizzle'
import { entregas } from '@/db/schema'

export type EntregaPayloadRespuesta = Omit<Entrega, 'save'>

export type EntregaPayloadCarga = EntregaPayloadRespuesta

export class Entrega {
	idEquipo: number
	idReparacion?: number
	fecha: Date
	idMetodoDePago?: number

	constructor(
		idEquipo: number,
		fecha: Date,
		idMetodoDePago?: number,
		idReparacion?: number
	) {
		this.idEquipo = idEquipo
		this.idReparacion = idReparacion
		this.fecha = fecha
		this.idMetodoDePago = idMetodoDePago
	}

	async save() {
		await db.insert(entregas).values({
			idEquipo: this.idEquipo,
			idReparacion: this.idReparacion,
			fecha: this.fecha,
			idMetodoDePago: this.idMetodoDePago,
		})

		return this
	}
}
