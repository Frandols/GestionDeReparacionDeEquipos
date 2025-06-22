import {
	PresupuestoPayloadCarga,
	Presupuesto as RepositorioPresupuestos,
} from '@/respositorios/presupuesto'

class Presupuesto {
	/**
	 *
	 * @param id ID del presupuesto
	 * @param presupuesto Datos del presupuesto
	 */
	static async aprobar(id: number, presupuesto: PresupuestoPayloadCarga) {
		const presupuestoActualizado = new RepositorioPresupuestos(
			presupuesto.monto,
			presupuesto.idRevision,
			presupuesto.detalles,
			true,
			id
		)

		presupuestoActualizado.update()
	}

	/**
	 * Desaprobar un presupuesto.
	 *
	 * @param id ID del presupuesto
	 * @param presupuesto Datos del presupuesto
	 */
	static async desaprobar(id: number, presupuesto: PresupuestoPayloadCarga) {
		const presupuestoActualizado = new RepositorioPresupuestos(
			presupuesto.monto,
			presupuesto.idRevision,
			presupuesto.detalles,
			false,
			id
		)

		presupuestoActualizado.update()
	}
}

export default Presupuesto
