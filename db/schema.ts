import { boolean, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'


export const clients = pgTable('clients', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	dni: varchar('dni', { length: 20 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull(),
	phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
	deleted: boolean().default(false).notNull(),
})

/**
 * Tabla que almacena la información de los equipos registrados, incluyendo referencias a cliente, marca, modelo y tipo.
 */
export const equipos = pgTable('equipos', {
	id: serial('id').primaryKey(),
	idCliente: integer('id_cliente').notNull().references(() => clients.id),
	nroSerie: varchar('nro_serie', { length: 100 }).notNull(),
	idMarca: integer('id_marca').notNull().references(() => marcas.id),
	idModelo: integer('id_modelo').notNull().references(() => modelos.id),
	razonDeIngreso: text('razon_de_ingreso').notNull(),
	observaciones: text('observaciones').notNull(),
	enciende: boolean('enciende').notNull().default(false),
	idTipoDeEquipo: integer('id_tipoDeEquipo').notNull().references(() => tipoDeEquipo.id),
	deleted: boolean('deleted').notNull().default(false),
})

/**
 * Tabla que almacena las marcas disponibles para los equipos.
 */
export const marcas = pgTable('marcas', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

/**
 * Tabla que almacena los modelos disponibles para los equipos.
 */
export const modelos = pgTable('modelos', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

/**
 * Tabla que almacena los tipos de equipos existentes.
 */
export const tipoDeEquipo = pgTable('tipoDeEquipo', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

