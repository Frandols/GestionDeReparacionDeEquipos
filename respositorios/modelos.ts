import db from '@/db/drizzle'
import { modelos } from '@/db/schema'

/*
  Tenemos un modelo adaptado ya que el servidor no puede enviar metodos
*/
export type ModeloAdaptado = Omit<Modelo, 'save' | 'getAll'> &
	Required<Pick<Modelo, 'id'>>

/**
 * Clase que representa un modelo con su descripción e ID.
 * Permite guardar un nuevo modelo en la base de datos y obtener todos los modelos existentes.
 */

export class Modelo {
	id?: number
	descripcion: string

	// Constructor de la clase Modelo
	constructor(descripcion: string, id?: number) {
		this.descripcion = descripcion
		if (id) this.id = id
	}

	// Función que guarda un nuevo modelo en la base de datos
	async save() {
		if (!this.descripcion.trim()) throw new Error('Descripción requerida')
		const result = await db
			.insert(modelos)
			.values({ descripcion: this.descripcion })
			.returning({ id: modelos.id })
		this.id = result[0].id
		return this
	}

	// Función que obtiene todos los modelos de la base de datos
	static async getAll(): Promise<ModeloAdaptado[]> {
		const rows = await db.select().from(modelos)
		return rows.map((row) => {
			const modelo = new Modelo(row.descripcion, row.id)

			return {
				...modelo,
				id: row.id,
			}
		})
	}
}
