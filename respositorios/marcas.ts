import db from '@/db/drizzle'
import { marcas} from '@/db/schema'
import { eq } from 'drizzle-orm'

export class Marca {
  id?: number
  descripcion: string

  constructor(descripcion: string, id?: number) {
    this.descripcion = descripcion
    if (id) this.id = id
  }

  async save() {
    if (!this.descripcion.trim()) throw new Error('Descripción requerida')
    const result = await db.insert(marcas).values({ descripcion: this.descripcion }).returning({ id: marcas.id })
    this.id = result[0].id
    return this
  }

  static async getAll(): Promise<Marca[]> {
    const rows = await db.select().from(marcas)
    return rows.map(row => new Marca(row.descripcion, row.id))
  }
}
