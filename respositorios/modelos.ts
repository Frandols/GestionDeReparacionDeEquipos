import db from '@/db/drizzle'
import { modelos } from '@/db/schema'
import { eq } from 'drizzle-orm'

export class Modelo {
  id?: number
  descripcion: string

  constructor(descripcion: string, id?: number) {
    this.descripcion = descripcion
    if (id) this.id = id
  }

  async save() {
    if (!this.descripcion.trim()) throw new Error('Descripción requerida')
    const result = await db.insert(modelos).values({ descripcion: this.descripcion }).returning({ id: modelos.id })
    this.id = result[0].id
    return this
  }

  static async getAll(): Promise<Modelo[]> {
    const rows = await db.select().from(modelos)
    return rows.map(row => new Modelo(row.descripcion, row.id))
  }
}