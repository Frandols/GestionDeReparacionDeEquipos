import db from '@/db/drizzle'
import { entregas } from '@/db/schema'

export type EntregaPayloadRespuesta = Omit<Entrega, 'save'>

export type EntregaPayloadCarga = EntregaPayloadRespuesta

export class Entrega {
	idReparacion?: number
	fecha: Date
	idMetodoDePago?: number

	constructor(fecha: Date, idMetodoDePago?: number, idReparacion?: number) {
		this.idReparacion = idReparacion
		this.fecha = fecha
		this.idMetodoDePago = idMetodoDePago
	}

	async save() {
		await db.insert(entregas).values({
			idReparacion: this.idReparacion,
			fecha: this.fecha,
			idMetodoDePago: this.idMetodoDePago,
		})

		return this
	}
}
