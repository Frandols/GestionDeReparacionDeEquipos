import db from '@/db/drizzle'
import { Client } from '@/respositorios/client'
import { Entrega, EntregaPayloadCarga } from '@/respositorios/entregas'
import {
	EquipoPayloadActualizacion,
	Equipo as RepositorioEquipos,
} from '@/respositorios/equipo'
import { Marca } from '@/respositorios/marcas'
import { MetodoDePago } from '@/respositorios/metodosDePago'
import { Modelo } from '@/respositorios/modelos'
import {
	Presupuesto,
	PresupuestoPayloadCarga,
} from '@/respositorios/presupuesto'
import {
	Reparacion,
	ReparacionPayloadActualizacion,
	ReparacionPayloadCreacion,
} from '@/respositorios/reparacion'
import { Revision } from '@/respositorios/revision'
import { TipoDeEquipo } from '@/respositorios/tipoDeEquipo'
import { currentUser } from '@clerk/nextjs/server'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

const formEditarEquipoSchema = z.object({
	idCliente: z.number().int().positive(),
	idTipoDeEquipo: z.number().int().positive(),
	nroSerie: z.string().min(1),
	idMarca: z.number().int().positive(),
	idModelo: z.number().int().positive(),
	razonDeIngreso: z.string().min(1),
	observaciones: z.string(),
	enciende: z.boolean(),
})

/**
 * Modelo del equipo.
 */
class Equipo {
	/**
	 * Obtener todos los equipos y las posibilidades para su modificacion.
	 */
	static async buscarEquipos() {
		const equipos = await RepositorioEquipos.getAll()
		const clientes = await Client.getAll()
		const tiposDeEquipo = await TipoDeEquipo.getAll()
		const marcas = await Marca.getAll()
		const modelos = await Modelo.getAll()
		const metodosDePago = await MetodoDePago.getAll()

		return {
			equipos,
			clientes,
			tiposDeEquipo,
			marcas,
			modelos,
			metodosDePago,
		}
	}

	/**
	 * Verificar la validez de los datos del equipo.
	 *
	 * @param equipo Los datos del equipo
	 * @returns Verdadero si los datos son validos, falso en caso contrario.
	 */
	static verificarDatosEquipo(equipo: EquipoPayloadActualizacion) {
		const resultado = formEditarEquipoSchema.safeParse(equipo)

		return resultado.success
	}

	/**
	 * Actualizar los datos del equipo.
	 *
	 * @param id ID del equipo.
	 * @param actualizacion Datos del equipo actualizado.
	 */
	static async actualizarEquipo(
		id: number,
		actualizacion: EquipoPayloadActualizacion
	) {
		const equipo = new RepositorioEquipos({ id, ...actualizacion })

		await equipo.update()
	}

	/**
	 * Crear un equipo.
	 *
	 * @param equipo Datos del equipo.
	 */
	static async crearEquipo(
		equipo: ConstructorParameters<typeof RepositorioEquipos>[0]
	) {
		const nuevoEquipo = new RepositorioEquipos(equipo)

		await nuevoEquipo.save()

		return nuevoEquipo
	}

	/**
	 * Eliminar un equipo.
	 *
	 * @param id ID del equipo a eliminar.
	 */
	static async eliminarEquipo(id: string) {
		const equipoExistente = await db.execute(
			sql`SELECT * FROM obtener_equipo_por_id(${id});`
		)

		if (equipoExistente.rows.length === 0)
			throw new Error('El equipo no existe')

		const { estado } = equipoExistente.rows[0]

		if (estado !== 'Entregado')
			throw new Error('El equipo no esta entregado, no se puede eliminar')

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const equipo = new RepositorioEquipos({ id } as any) // Cast para solo ID.

		await equipo.delete()
	}

	static async activarEquipo(id: number) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const equipo = new RepositorioEquipos({ id } as any) // Cast para solo ID.

		await equipo.restore()
	}

	/**
	 * Iniciar la revision del equipo.
	 *
	 * @param idEquipo
	 */
	static async iniciarRevision(idEquipo: number) {
		const nuevaRevision = new Revision(idEquipo, null, null)

		await nuevaRevision.save()
	}

	/**
	 * Finalizar la revision del equipo.
	 *
	 * @param idEquipo
	 * @param observaciones
	 */
	static async finalizarRevision(idEquipo: number, observaciones: string) {
		const nuevaRevision = new Revision(idEquipo, observaciones, new Date())

		await nuevaRevision.update()
	}

	/**
	 * Asignar presupuesto al equipo.
	 *
	 * @param presupuesto Datos del presupuesto.
	 * @returns ID del presupuesto asignado.
	 */
	static async asignarPresupuesto(presupuesto: PresupuestoPayloadCarga) {
		const nuevoPresupuesto = new Presupuesto(
			presupuesto.monto,
			presupuesto.idRevision,
			presupuesto.detalles,
			null
		)

		const { id } = await nuevoPresupuesto.save()

		return id as number
	}

	/**
	 * Dar por iniciada la reparacion del equipo.
	 *
	 * @param reparacion Datos de la reparacion.
	 */
	static async iniciarReparacion(
		reparacion: Omit<ReparacionPayloadCreacion, 'idUsuario'>
	) {
		const user = await currentUser()

		if (!user) return

		const nuevaReparacion = new Reparacion(
			reparacion.idPresupuesto,
			null,
			null,
			null,
			false,
			user.id
		)

		await nuevaReparacion.save()
	}

	/**
	 * Dar por finalizada la reparacion del equipo.
	 *
	 * @param reparacion Datos del reparacion.
	 */
	static async finalizarReparacion(
		reparacion: Omit<
			ReparacionPayloadActualizacion,
			'idUsuario' | 'fechaDeFinalizacion'
		>
	) {
		const user = await currentUser()

		if (!user) return

		const nuevaReparacion = new Reparacion(
			reparacion.idPresupuesto,
			reparacion.observaciones,
			new Date(),
			reparacion.reparado,
			reparacion.irreparable,
			user.id
		)

		await nuevaReparacion.update()
	}

	/**
	 * Dar el equipo por entregado.
	 *
	 * @param entrega Datos de la entrega.
	 */
	static async entregarEquipo(entrega: Omit<EntregaPayloadCarga, 'fecha'>) {
		const nuevaEntrega = new Entrega(
			entrega.idEquipo,
			new Date(),
			entrega.idMetodoDePago,
			entrega.idReparacion
		)

		await nuevaEntrega.save()
	}
}

export default Equipo
