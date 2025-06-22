import db from '@/db/drizzle'
import { presupuestos } from '@/db/schema'
import { eq } from 'drizzle-orm'

export type PresupuestoPayloadRespuesta = Omit<Presupuesto, 'save' | 'update'> &
	Required<Pick<Presupuesto, 'id'>>

export type PresupuestoPayloadCarga = Omit<
	Presupuesto,
	'save' | 'update' | 'id' | 'aprobado'
>

export class Presupuesto {
	id?: number
	idRevision: number
	monto: number
	detalles: string
	aprobado: boolean | null

	constructor(
		monto: number,
		idRevision: number,
		detalles: string,
		aprobado: boolean | null,
		id?: number
	) {
		this.monto = monto
		if (id) this.id = id
		this.idRevision = idRevision
		this.detalles = detalles
		this.aprobado = aprobado
	}

	async save() {
		if (!this.detalles.trim()) throw new Error('Detalles requeridos')
		if (!this.monto || this.monto < 1) throw new Error('Monto requerido')
		if (!this.idRevision) throw new Error('ID de la revision requerido')

		const result = await db
			.insert(presupuestos)
			.values({
				idRevision: this.idRevision,
				detalles: this.detalles,
				monto: this.monto,
			})
			.returning({ id: presupuestos.id })

		this.id = result[0].id

		return this
	}

	async update() {
		if (!this.id) return

		await db
			.update(presupuestos)
			.set({
				aprobado: this.aprobado,
			})
			.where(eq(presupuestos.id, this.id))

		return this
	}
}
