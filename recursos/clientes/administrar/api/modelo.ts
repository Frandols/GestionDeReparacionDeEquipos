import { Client, ClienteAdaptado } from '@/respositorios/client'
import { clerkClient, User } from '@clerk/nextjs/server'

const modeloClientes = {
	async obtenerTodos() {
		const clients = await Client.getAll()

		return clients
	},
	async crear(userId: User['id'], datos: Partial<ClienteAdaptado>) {
		const clerk = await clerkClient()
		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador') {
			throw new Error('El usuario debe ser administrador')
		}

		const client = Client.create(datos)

		if (client instanceof Error) {
			switch (client.message) {
				case 'FALTAN_CAMPOS':
					throw new Error('Faltan campos por completar')
				case 'DNI_INVALIDO':
					throw new Error('El DNI ingresado no es válido.')
				case 'EMAIL_INVALIDO':
					throw new Error('El correo electrónico no es válido.')
				case 'PHONE_INVALIDO':
					throw new Error('El número de teléfono no es válido.')
				default:
					throw new Error('No se pudo crear el cliente')
			}
		}

		try {
			const result = await client.save()
			if (!result.success) {
				throw new Error('No se pudo guardar el cliente')
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message)
			}
			throw new Error('Ocurrió un error al guardar el cliente')
		}

		return client
	}


}

export default modeloClientes
