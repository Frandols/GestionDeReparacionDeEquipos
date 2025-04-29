import { Client, ClientData } from '@/respositorios/client'
import { clerkClient, User } from '@clerk/nextjs/server'

const modeloClientes = {
	async obtenerTodos() {
		const clients = await Client.getAll()

		return clients
	},
	async crear(userId: User['id'], datos: Partial<ClientData>) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = Client.create(datos)

		if (client instanceof Error) {
			throw new Error('No se pudo crear el cliente')
		}

		const result = await client.save()

		if (!result.success) throw new Error('No se pudo guardar el cliente')

		return client
	},
}

export default modeloClientes
