import db from '@/db/drizzle';
import { equipos } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Clase que representa un equipo con sus datos principales y estado de eliminación.
 * Permite crear, actualizar, eliminar lógicamente y consultar equipos en la base de datos.
 */
export class Equipo {
  id?: number;
  idCliente: number;
  nroSerie: string;
  idMarca: number;
  idModelo: number;
  razonDeIngreso: string;
  observaciones: string;
  enciende: boolean;
  idTipoDeEquipo: number;
  deleted: boolean;

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
    idCliente: number;
    nroSerie: string;
    idMarca: number;
    idModelo: number;
    razonDeIngreso: string;
    observaciones: string;
    enciende: boolean;
    idTipoDeEquipo: number;
    deleted?: boolean;
    id?: number;
  }) {
    this.idCliente = idCliente;
    this.nroSerie = nroSerie;
    this.idMarca = idMarca;
    this.idModelo = idModelo;
    this.razonDeIngreso = razonDeIngreso;
    this.observaciones = observaciones;
    this.enciende = enciende;
    this.idTipoDeEquipo = idTipoDeEquipo;
    this.deleted = deleted ?? false;
    if (id) this.id = id;
  }

  /**
   * Guarda un nuevo equipo en la base de datos.
   * Valida que los campos obligatorios no estén vacíos.
   */
  async save() {
    if (!this.nroSerie.trim()) throw new Error('Número de serie requerido');
    if (!this.razonDeIngreso.trim()) throw new Error('Razón de ingreso requerida');
    if (!this.observaciones.trim()) throw new Error('Observaciones requeridas');

    const result = await db.insert(equipos).values({
      idCliente: this.idCliente,
      nroSerie: this.nroSerie,
      idMarca: this.idMarca,
      idModelo: this.idModelo,
      razonDeIngreso: this.razonDeIngreso,
      observaciones: this.observaciones,
      enciende: this.enciende,
      idTipoDeEquipo: this.idTipoDeEquipo,
      deleted: this.deleted,
    }).returning({ id: equipos.id });

    this.id = result[0].id;
    return this;
  }

  /**
   * Actualiza un equipo existente en la base de datos.
   * Requiere que el equipo tenga un ID definido.
   */
  async update() {
    if (!this.id) throw new Error('ID requerido para actualizar');

    await db.update(equipos)
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
      .where(eq(equipos.id, this.id));

    return this;
  }

  /**
   * Elimina lógicamente un equipo (marca como eliminado).
   * Requiere que el equipo tenga un ID definido.
   */
  async delete() {
    if (!this.id) throw new Error('ID requerido para eliminar');

    await db.update(equipos)
      .set({ deleted: true })
      .where(eq(equipos.id, this.id));

    this.deleted = true;
    return this;
  }

  /**
   * Obtiene todos los equipos que no están eliminados.
   */
  static async getAll(): Promise<Equipo[]> {
    const rows = await db.select().from(equipos).where(eq(equipos.deleted, false));
    return rows.map(row => new Equipo({
      id: row.id,
      idCliente: row.idCliente,
      nroSerie: row.nroSerie,
      idMarca: row.idMarca,
      idModelo: row.idModelo,
      razonDeIngreso: row.razonDeIngreso,
      observaciones: row.observaciones,
      enciende: row.enciende,
      idTipoDeEquipo: row.idTipoDeEquipo,
      deleted: row.deleted,
    }));
  }

  /**
   * Obtiene un equipo por su ID si no está eliminado.
   * @param id ID del equipo a buscar.
   */
  static async getById(id: number): Promise<Equipo | null> {
    const rows = await db.select()
      .from(equipos)
      .where(and(eq(equipos.id, id), eq(equipos.deleted, false)))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Equipo({
      id: row.id,
      idCliente: row.idCliente,
      nroSerie: row.nroSerie,
      idMarca: row.idMarca,
      idModelo: row.idModelo,
      razonDeIngreso: row.razonDeIngreso,
      observaciones: row.observaciones,
      enciende: row.enciende,
      idTipoDeEquipo: row.idTipoDeEquipo,
      deleted: row.deleted,
    });
  }
}
