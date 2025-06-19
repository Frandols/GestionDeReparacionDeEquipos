import db from '@/db/drizzle'
import { marcas } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Clase que representa una marca con su descripción e ID.
 * Permite guardar una nueva marca en la base de datos y obtener todas las marcas existentes.
 */
export class Marca {
  id?: number
  descripcion: string

  // Constructor de la clase Marca
  constructor(descripcion: string, id?: number) {
    this.descripcion = descripcion
    if (id) this.id = id
  }

  // Función que guarda una nueva marca en la base de datos
  async save() {
    if (!this.descripcion.trim()) throw new Error('Descripción requerida')
    const result = await db.insert(marcas).values({ descripcion: this.descripcion }).returning({ id: marcas.id })
    this.id = result[0].id
    return this
  }

  // Función que obtiene todas las marcas de la base de datos
  static async getAll(): Promise<Marca[]> {
    const rows = await db.select().from(marcas)
    return rows.map(row => new Marca(row.descripcion, row.id))
  }
}
