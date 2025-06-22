'use server'

import Presupuesto from '@/recursos/presupuesto/modelo'
import { PresupuestoPayloadCarga } from '@/respositorios/presupuesto'

export default async function editarPresupuesto(
	id: number,
	presupuesto: PresupuestoPayloadCarga,
	aprobado: boolean
) {
	if (aprobado) await Presupuesto.aprobar(id, presupuesto)

	await Presupuesto.desaprobar(id, presupuesto)
}
