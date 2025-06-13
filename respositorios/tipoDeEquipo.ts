import db from '@/db/drizzle'
import { tipoDeEquipo } from '@/db/schema'
import { eq } from 'drizzle-orm'

export class TipoDeEquipo {
  id?: number
  descripcion: string

  constructor(descripcion: string, id?: number) {
    this.descripcion = descripcion
    if (id) this.id = id
  }

  async save() {
    if (!this.descripcion.trim()) throw new Error('Descripción requerida')
    const result = await db.insert(tipoDeEquipo).values({ descripcion: this.descripcion }).returning({ id: tipoDeEquipo.id })
    this.id = result[0].id
    return this
  }

  static async getAll(): Promise<TipoDeEquipo[]> {
    const rows = await db.select().from(tipoDeEquipo)
    return rows.map(row => new TipoDeEquipo(row.descripcion, row.id))
  }
}