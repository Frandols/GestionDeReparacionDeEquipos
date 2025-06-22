import db from '@/db/drizzle'
import { clients } from '@/db/schema'
import { eq } from 'drizzle-orm'

/*
  Tenemos un cliente adaptado ya que el servidor no puede enviar metodos
*/
export type ClienteAdaptado = Omit<Client, 'save' | 'getAll'> &
	Required<Pick<Client, 'id'>>

export class Client {
	id?: number
	firstName: string
	lastName: string
	dni: string
	email: string
	phoneNumber: string
	deleted: boolean

	private constructor(params: ClienteAdaptado) {
		this.id = params.id
		this.firstName = params.firstName
		this.lastName = params.lastName
		this.dni = params.dni
		this.email = params.email
		this.phoneNumber = params.phoneNumber
		this.deleted = params.deleted
	}

	static create(params: Partial<ClienteAdaptado>): Client | Error {
		if (
			!params.firstName?.trim() ||
			!params.lastName?.trim() ||
			!params.dni?.trim() ||
			!params.email?.trim() ||
			!params.phoneNumber?.trim()
		) {
			return new Error('FALTAN_CAMPOS')
		}

		if (!/^\d{8}$/.test(params.dni)) {
			return new Error('DNI_INVALIDO')
		}

		if (!Client.isValidEmail(params.email)) {
			return new Error('EMAIL_INVALIDO')
		}

		if (!/^\d{10,15}$/.test(params.phoneNumber)) {
			return new Error('PHONE_INVALIDO')
		}

		return new Client(params as ClienteAdaptado)
	}

	private static isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	public async save() {
		try {
			await db.insert(clients).values({
				firstName: this.firstName,
				lastName: this.lastName,
				dni: this.dni,
				email: this.email,
				phoneNumber: this.phoneNumber,
				deleted: this.deleted,
			})
			return { success: true }
		} catch (error: any) {
			console.error('Error al guardar cliente:', error)

			if (
				error instanceof Error &&
				error.message.includes('duplicate key value') &&
				error.message.includes('clients_dni_unique')
			) {
				throw new Error('Este cliente ya está registrado en el sistema')
			}

			throw error
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

	static async getAll(): Promise<ClienteAdaptado[]> {
		const result = await db.select().from(clients)

		return result.map((clientData) => {
			const client = new Client(clientData)

			return {
				id: clientData.id,
				firstName: client.firstName,
				lastName: client.lastName,
				dni: client.dni,
				email: client.email,
				phoneNumber: client.phoneNumber,
				deleted: client.deleted,
			}
		})
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

	static async updateByDni(
		dni: string,
		data: Partial<ClienteAdaptado>
	): Promise<boolean> {
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
