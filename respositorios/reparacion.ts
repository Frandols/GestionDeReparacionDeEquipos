import db from '@/db/drizzle'
import { reparaciones } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { PresupuestoPayloadRespuesta } from './presupuesto'

export type ReparacionPayloadRespuesta = Omit<
	Reparacion,
	'save' | 'getAll' | 'update'
>

export type ReparacionPayloadCreacion = Pick<
	Omit<Reparacion, 'save' | 'getAll' | 'update'>,
	'idPresupuesto' | 'idUsuario'
>

export type ReparacionPayloadActualizacion = Omit<
	Reparacion,
	'save' | 'getAll' | 'update'
>

export class Reparacion {
	idPresupuesto: Required<PresupuestoPayloadRespuesta['id']>
	observaciones: string | null
	fechaDeFinalizacion: Date | null
	reparado: boolean | null
	irreparable: boolean
	idUsuario: string

	constructor(
		idPresupuesto: number,
		observaciones: string | null,
		fechaDeFinalizacion: Date | null,
		reparado: boolean | null,
		irreparable: boolean,
		idUsuario: string
	) {
		this.idPresupuesto = idPresupuesto
		this.observaciones = observaciones
		this.fechaDeFinalizacion = fechaDeFinalizacion
		this.reparado = reparado
		this.irreparable =
			this.reparado === null ? false : this.reparado ? false : irreparable
		this.idUsuario = idUsuario
	}

	async save() {
		await db.insert(reparaciones).values({
			idPresupuesto: this.idPresupuesto,
			observaciones: null,
			fechaDeFinalizacion: null,
			reparado: null,
			irreparable: false,
			idUsuario: this.idUsuario,
		})

		return this
	}

	async update() {
		await db
			.update(reparaciones)
			.set({
				observaciones: this.observaciones,
				fechaDeFinalizacion: new Date(),
				reparado: this.reparado,
				irreparable: this.irreparable,
			})
			.where(eq(reparaciones.idPresupuesto, this.idPresupuesto))
	}
}
