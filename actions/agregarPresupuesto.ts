'use server'

import {
	Presupuesto,
	PresupuestoPayloadCarga,
} from '@/respositorios/presupuesto'

export default async function agregarPresupuesto(
	presupuesto: PresupuestoPayloadCarga
) {
	const nuevoPresupuesto = new Presupuesto(
		presupuesto.monto,
		presupuesto.idRevision,
		presupuesto.detalles,
		null
	)

	const { id } = await nuevoPresupuesto.save()

	return id as number
}
