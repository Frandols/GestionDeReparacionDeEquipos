'use server'

import Equipo from '@/recursos/equipos/modelo'
import { PresupuestoPayloadCarga } from '@/respositorios/presupuesto'

export default async function agregarPresupuesto(
	presupuesto: PresupuestoPayloadCarga
) {
	return await Equipo.asignarPresupuesto(presupuesto)
}
