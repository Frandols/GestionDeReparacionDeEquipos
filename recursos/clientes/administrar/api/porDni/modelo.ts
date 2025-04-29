import { Client, ClientData } from '@/respositorios/client'
import { clerkClient, User } from '@clerk/nextjs/server'

const modeloAdministrarClientes = {
	async obtenerCliente(dni: Client['dni']) {
		const cliente = await Client.getByDni(dni)

		if (!cliente) throw new Error('Cliente no encontrado')

		return cliente
	},
	async eliminarCliente(userId: User['id'], clienteDNI: Client['dni']) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.deleteByDni(clienteDNI)

		if (!success) throw new Error('No se pudo eliminar el cliente')
	},
	async restaurarCliente(userId: User['id'], clienteDNI: Client['dni']) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.restoreByDni(clienteDNI)

		if (!success) throw new Error('No se pudo restaurar el cliente')
	},
	async modificarCliente(
		userId: User['id'],
		clienteDNI: Client['dni'],
		datosActualizados: Partial<ClientData>
	) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.updateByDni(clienteDNI, datosActualizados)

		if (!success) throw new Error('No se pudo modificar el cliente')
	},
}

export default modeloAdministrarClientes
