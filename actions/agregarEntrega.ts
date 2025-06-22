'use server'

import Equipo from '@/recursos/equipos/modelo'
import { EntregaPayloadCarga } from '@/respositorios/entregas'

export default async function agregarEntrega(
	entrega: Omit<EntregaPayloadCarga, 'fecha'>
) {
	await Equipo.entregarEquipo(entrega)
}
