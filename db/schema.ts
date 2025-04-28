import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const clients = pgTable('clients', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	dni: varchar('dni', { length: 20 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull(),
	phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
	deleted: boolean().default(false).notNull(),
})
