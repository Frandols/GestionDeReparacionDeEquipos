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

export const equipos = pgTable('equipos', {
	id: serial('id').primaryKey(),
	idCliente: integer('id_cliente').notNull().references(() => clients.id),
	idTipoDeEquipo: integer('id_modelo').notNull().references(() => tipoDeEquipo.id),
	nroSerie: varchar('nro_serie', { length: 100 }).notNull(),
	idMarca: integer('id_marca').notNull().references(() => marcas.id),
	idModelo: integer('id_modelo').notNull().references(() => modelos.id),
	razonDeIngreso: text('razon_de_ingreso').notNull(),
	observaciones: text('observaciones').notNull(),
	enciende: boolean('enciende').notNull().default(false),
})

export const marcas = pgTable('marcas', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

export const modelos = pgTable('modelos', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

export const tipoDeEquipo = pgTable('tipoDeEquipo', {
	id: serial('id').primaryKey(),
	descripcion: text('descripcion').notNull(),
})

