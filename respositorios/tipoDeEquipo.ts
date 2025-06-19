import db from '@/db/drizzle'
import { tipoDeEquipo } from '@/db/schema'
import { eq } from 'drizzle-orm'


/**
 * Clase que representa el tipo de equipo con su descripción e ID opcional.
 * Permite guardar un nuevo tipo en la base de datos y obtener todos los tipos existentes.
 */
export class TipoDeEquipo {
  id?: number
  descripcion: string


  // Constructor de la clase tipo de equipo
  constructor(descripcion: string, id?: number) {
    this.descripcion = descripcion
    if (id) this.id = id
  }

  //Funcion que guarda un nuevo tipo de equipo en la base de datos
  async save() {
    if (!this.descripcion.trim()) throw new Error('Descripción requerida')
    const result = await db.insert(tipoDeEquipo).values({ descripcion: this.descripcion }).returning({ id: tipoDeEquipo.id })
    this.id = result[0].id
    return this
  }

  //Funcion que obtiene todos los tipo de equipos de la base de datos
  static async getAll(): Promise<TipoDeEquipo[]> {
    const rows = await db.select().from(tipoDeEquipo)
    return rows.map(row => new TipoDeEquipo(row.descripcion, row.id))
  }
}