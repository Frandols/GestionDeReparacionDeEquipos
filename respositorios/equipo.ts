import db from '@/db/drizzle'
import { equipos } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { RevisionPayloadRespuesta } from './revision'

export type EquipoPayloadRespuesta = Omit<
	Equipo,
	'save' | 'update' | 'delete' | 'restore'
> &
	Required<Pick<Equipo, 'id'>> & {
		nombreCliente: string
		nombreMarca: string
		nombreModelo: string
		nombreTipoDeEquipo: string
		revision: Omit<RevisionPayloadRespuesta, 'idEquipo'> | null
		presupuesto: {
			id: number
			monto: number
			detalle: string
			aprobado: boolean | null
		} | null
		reparacion:
			| ({
					observaciones: string | null
			  } & (
					| {
							fechaDeFinalizacion: Date
							reparado: boolean
							irreparable: boolean
					  }
					| { fechaDeFinalizacion: null; reparado: null; irreparable: false }
			  ))
			| null
		entrega: {
			fecha: Date
			metodoDePago: string | null
		} | null
		estado: string
	}

export type EquipoPayloadActualizacion = Omit<
	Equipo,
	'save' | 'update' | 'delete' | 'id' | 'restore'
>

/**
 * Clase que representa un equipo con sus datos principales y estado de eliminación.
 * Permite crear, actualizar, eliminar lógicamente y consultar equipos en la base de datos.
 */
export class Equipo {
	id?: number
	idCliente: number
	nroSerie: string
	idMarca: number
	idModelo: number
	razonDeIngreso: string
	observaciones: string
	enciende: boolean
	idTipoDeEquipo: number
	deleted: boolean

	/**
	 * Constructor que inicializa un equipo con sus propiedades.
	 * @param params Objeto con datos del equipo.
	 */
	constructor({
		idCliente,
		nroSerie,
		idMarca,
		idModelo,
		razonDeIngreso,
		observaciones,
		enciende,
		idTipoDeEquipo,
		deleted = false,
		id,
	}: {
		idCliente: number
		nroSerie: string
		idMarca: number
		idModelo: number
		razonDeIngreso: string
		observaciones: string
		enciende: boolean
		idTipoDeEquipo: number
		deleted: boolean
		id?: number
	}) {
		this.idCliente = idCliente
		this.nroSerie = nroSerie
		this.idMarca = idMarca
		this.idModelo = idModelo
		this.razonDeIngreso = razonDeIngreso
		this.observaciones = observaciones
		this.enciende = enciende
		this.idTipoDeEquipo = idTipoDeEquipo
		this.deleted = deleted ?? false
		if (id) this.id = id
	}

	/**
	 * Guarda un nuevo equipo en la base de datos.
	 * Valida que los campos obligatorios no estén vacíos.
	 */
	async save() {
		if (!this.nroSerie.trim()) throw new Error('Número de serie requerido')
		if (!this.razonDeIngreso.trim())
			throw new Error('Razón de ingreso requerida')
		if (!this.observaciones.trim()) throw new Error('Observaciones requeridas')

		const result = await db
			.insert(equipos)
			.values({
				idCliente: this.idCliente,
				nroSerie: this.nroSerie,
				idMarca: this.idMarca,
				idModelo: this.idModelo,
				razonDeIngreso: this.razonDeIngreso,
				observaciones: this.observaciones,
				enciende: this.enciende,
				idTipoDeEquipo: this.idTipoDeEquipo,
				deleted: this.deleted,
			})
			.returning({ id: equipos.id })

		this.id = result[0].id
		return this
	}

	/**
	 * Actualiza un equipo existente en la base de datos.
	 * Requiere que el equipo tenga un ID definido.
	 */
	async update() {
		if (!this.id) throw new Error('ID requerido para actualizar')

		await db
			.update(equipos)
			.set({
				idCliente: this.idCliente,
				nroSerie: this.nroSerie,
				idMarca: this.idMarca,
				idModelo: this.idModelo,
				razonDeIngreso: this.razonDeIngreso,
				observaciones: this.observaciones,
				enciende: this.enciende,
				idTipoDeEquipo: this.idTipoDeEquipo,
			})
			.where(eq(equipos.id, this.id))

		return this
	}

	/**
	 * Elimina lógicamente un equipo (marca como eliminado).
	 * Requiere que el equipo tenga un ID definido.
	 */
	async delete() {
		if (!this.id) throw new Error('ID requerido para eliminar')

		await db
			.update(equipos)
			.set({ deleted: true })
			.where(eq(equipos.id, this.id))

		this.deleted = true
		return this
	}

	/**
	 * Obtiene todos los equipos que no están eliminados.
	 */
	static async getAll(): Promise<EquipoPayloadRespuesta[]> {
		const resultado = await db.execute(sql`SELECT * FROM obtener_equipos()`)

		return resultado.rows.map((row) => ({
			...new Equipo({
				id: row.id as number,
				idCliente: row.id_cliente as number,
				nroSerie: row.nro_serie as string,
				idMarca: row.id_marca as number,
				idModelo: row.id_modelo as number,
				razonDeIngreso: row.razon_de_ingreso as string,
				observaciones: row.observaciones as string,
				enciende: row.enciende as boolean,
				idTipoDeEquipo: row.id_tipodeequipo as number,
				deleted: row.deleted as boolean,
			}),
			id: row.id as number,
			nombreCliente: row.cliente as string,
			nombreMarca: row.marca as string,
			nombreModelo: row.modelo as string,
			nombreTipoDeEquipo: row.tipodeequipo as string,
			revision:
				row.revisiones_idequipo === null
					? null
					: {
							observaciones: row.revisiones_observaciones as string,
							fechaDeFinalizacion: row.revisiones_fechadefinalizacion as Date,
					  },
			presupuesto:
				row.presupuestos_id === null
					? null
					: {
							id: row.presupuestos_id as number,
							monto: row.presupuestos_monto as number,
							detalle: row.prespuestos_detalle as string,
							aprobado: row.presupuestos_aprobado as boolean,
					  },
			reparacion:
				row.reparaciones_idpresupuesto === null
					? null
					: {
							observaciones: row.observaciones_reparacion as string,
							...(row.fechadefinalizacion_reparacion === null
								? {
										fechaDeFinalizacion: null,
										reparado: null,
										irreparable: false,
								  }
								: {
										fechaDeFinalizacion:
											row.fechadefinalizacion_reparacion as Date,
										...(row.reparaciones_reparado === true
											? {
													reparado: true,
													irreparable: false,
											  }
											: {
													reparado: false,
													irreparable: true,
											  }),
								  }),
					  },
			entrega:
				row.entregas_idequipo === null
					? null
					: {
							fecha: row.entregas_fecha as Date,
							metodoDePago: row.metodoDePago as string,
					  },
			estado: row.estado as string,
		}))
	}

	/**
	 * Obtiene un equipo por su ID si no está eliminado.
	 * @param id ID del equipo a buscar.
	 */
	static async getById(id: number): Promise<EquipoPayloadRespuesta | null> {
		const resultado = await db.execute(sql`SELECT * FROM obtener_equipo(${id})`)

		if (resultado.rows.length === 0) return null

		const row = resultado.rows[0]

		return {
			...new Equipo({
				id: row.id as number,
				idCliente: row.id_cliente as number,
				nroSerie: row.nro_serie as string,
				idMarca: row.id_marca as number,
				idModelo: row.id_modelo as number,
				razonDeIngreso: row.razon_de_ingreso as string,
				observaciones: row.observaciones as string,
				enciende: row.enciende as boolean,
				idTipoDeEquipo: row.id_tipodeequipo as number,
				deleted: row.deleted as boolean,
			}),
			id: row.id as number,
			nombreCliente: row.cliente as string,
			nombreMarca: row.marca as string,
			nombreModelo: row.modelo as string,
			nombreTipoDeEquipo: row.tipodeequipo as string,
			revision:
				row.revisiones_idequipo === null
					? null
					: {
							observaciones: row.revisiones_observaciones as string,
							fechaDeFinalizacion: row.revisiones_fechadefinalizacion as Date,
					  },
			presupuesto:
				row.presupuestos_id === null
					? null
					: {
							id: row.presupuestos_id as number,
							monto: row.presupuestos_monto as number,
							detalle: row.presupuestos_detalle as string,
							aprobado: row.presupuestos_aprobado as boolean,
					  },
			reparacion:
				row.reparaciones_idpresupuesto === null
					? null
					: {
							observaciones: row.observaciones_reparacion as string,
							...(row.fechadefinalizacion_reparacion === null
								? {
										fechaDeFinalizacion: null,
										reparado: null,
										irreparable: false,
								  }
								: {
										fechaDeFinalizacion:
											row.fechadefinalizacion_reparacion as Date,
										...(row.reparaciones_reparado === true
											? {
													reparado: true,
													irreparable: false,
											  }
											: {
													reparado: false,
													irreparable: true,
											  }),
								  }),
					  },
			entrega:
				row.entregas_idequipo === null
					? null
					: {
							fecha: row.entregas_fecha as Date,
							metodoDePago: row.metodoDePago as string,
					  },
			estado: row.estado as string,
		}
	}

	async restore() {
		await db
			.update(equipos)
			.set({ deleted: false })
			.where(eq(equipos.id, this.id as number))
	}
}
