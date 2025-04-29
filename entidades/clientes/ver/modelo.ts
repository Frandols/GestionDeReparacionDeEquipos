import { Client } from '@/respositorios/client'

const modeloVerClientes = {
	obtenerClientes: async () => {
		const clients = await Client.getAll()

		const adaptedClients: Omit<Client, 'save'>[] = clients.map((client) => ({
			id: client.id,
			firstName: client.firstName,
			lastName: client.lastName,
			email: client.email,
			phoneNumber: client.phoneNumber,
			dni: client.dni,
			deleted: client.deleted,
		}))

		return adaptedClients
	},
}

export default modeloVerClientes
