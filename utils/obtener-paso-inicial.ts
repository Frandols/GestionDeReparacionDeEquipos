import { EquipoPayloadRespuesta } from '@/respositorios/equipo'

export default function obtenerPasoInicial(
	equipo: EquipoPayloadRespuesta
): number {
	if (equipo.revision === null) return 0

	if (equipo.presupuesto === null) return 1

	if (equipo.reparacion === null) return 2

	if (equipo.entrega === null) return 3

	return 4
}
