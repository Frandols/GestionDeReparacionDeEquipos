import db from '@/db/drizzle'
import { clients } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface ClientData {
	id?: number
	firstName: string
	lastName: string
	dni: string
	email: string
	phoneNumber: string
	deleted: boolean
}

export class Client {
	id?: number
	firstName: string
	lastName: string
	dni: string
	email: string
	phoneNumber: string
	deleted: boolean

	private constructor(params: ClientData) {
		this.id = params.id
		this.firstName = params.firstName
		this.lastName = params.lastName
		this.dni = params.dni
		this.email = params.email
		this.phoneNumber = params.phoneNumber
		this.deleted = params.deleted
	}

	static create(params: Partial<ClientData>): Client | Error {
		if (!params.firstName || params.firstName.trim() === '') {
			return new Error('First name is required.')
		}
		if (!params.lastName || params.lastName.trim() === '') {
			return new Error('Last name is required.')
		}
		if (!params.dni || params.dni.trim() === '') {
			return new Error('DNI is required.')
		}
		if (!params.email || !Client.isValidEmail(params.email)) {
			return new Error('Valid email is required.')
		}
		if (!params.phoneNumber || params.phoneNumber.trim() === '') {
			return new Error('Phone number is required.')
		}

		return new Client(params as ClientData)
	}

	private static isValidEmail(email: string): boolean {
		// Very basic email check
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	public async save() {
		try {
			const result = await db
				.insert(clients)
				.values({
					firstName: this.firstName,
					lastName: this.lastName,
					dni: this.dni,
					email: this.email,
					phoneNumber: this.phoneNumber,
				})
				.returning({ id: clients.id })

			this.id = result[0].id
			return { success: true }
		} catch (error: any) {
			if (error.code === '23505') {
				return { success: false, reason: 'DNI_ALREADY_EXISTS' }
			}
			console.error('Unexpected DB error:', error)
			return { success: false, reason: 'UNKNOWN_ERROR' }
		}
	}

	static async getByDni(dni: string): Promise<Client | null> {
		const result = await db
			.select()
			.from(clients)
			.where(eq(clients.dni, dni))
			.limit(1)

		if (result.length === 0) {
			return null
		}

		const clientData = result[0]
		return new Client(clientData)
	}

	static async getAll(): Promise<Client[]> {
		const result = await db.select().from(clients)
		console.log(result)
		return result.map((clientData) => new Client(clientData))
	}

	static async deleteByDni(dni: string): Promise<boolean> {
		try {
			// Intentamos actualizar el cliente para marcarlo como eliminado
			const result = await db
				.update(clients)
				.set({ deleted: true }) // Establecemos `deleted` a true
				.where(eq(clients.dni, dni))

			// Verificamos si se ha afectado alguna fila
			return result ? true : false
		} catch (error) {
			console.error('Error marking client as deleted by DNI:', error)
			return false
		}
	}

	static async restoreByDni(dni: string): Promise<boolean> {
		try {
			// Actualizamos el cliente para poner deleted en false
			const result = await db
				.update(clients)
				.set({ deleted: false })
				.where(eq(clients.dni, dni))

			// Verificamos si afectó alguna fila
			return result ? true : false
		} catch (error) {
			console.error('Error restoring client by DNI:', error)
			return false
		}
	}

	static async updateByDni(dni: string, data: Partial<ClientData>): Promise<boolean> {
		try {
		  const result = await db
			.update(clients)
			.set(data)
			.where(eq(clients.dni, dni))
	  
		  return result ? true : false
		} catch (error) {
		  console.error('Error al actualizar cliente:', error)
		  return false
		}
	  }
	  
}
