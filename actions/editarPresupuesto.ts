'use server'

import {
	Presupuesto,
	PresupuestoPayloadCarga,
} from '@/respositorios/presupuesto'

export default async function editarPresupuesto(
	id: number,
	presupuesto: PresupuestoPayloadCarga,
	aprobado: boolean
) {
	const presupuestoActualizado = new Presupuesto(
		presupuesto.monto,
		presupuesto.idRevision,
		presupuesto.detalles,
		aprobado,
		id
	)

	presupuestoActualizado.update()
}
