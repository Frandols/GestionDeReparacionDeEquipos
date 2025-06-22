import { Client, ClienteAdaptado } from '@/respositorios/client'
import { clerkClient, User } from '@clerk/nextjs/server'

class Cliente {
	/**
	 * Obtener todos los clientes.
	 *
	 * @returns Lista de clientes.
	 */
	static async obtenerClientes() {
		const clients = await Client.getAll()

		const adaptedClients: ClienteAdaptado[] = clients.map((client) => ({
			id: client.id,
			firstName: client.firstName,
			lastName: client.lastName,
			email: client.email,
			phoneNumber: client.phoneNumber,
			dni: client.dni,
			deleted: client.deleted,
		}))

		return adaptedClients
	}

	/**
	 * Obtener un cliente.
	 *
	 * @returns Datos del cliente.
	 */
	static async obtenerCliente(dni: Client['dni']) {
		const cliente = await Client.getByDni(dni)

		if (!cliente) throw new Error('Cliente no encontrado')

		return cliente
	}

	/**
	 * Eliminar un cliente.
	 *
	 * @throws Error si no se pudo eliminar.
	 */
	static async eliminarCliente(userId: User['id'], clienteDNI: Client['dni']) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.deleteByDni(clienteDNI)

		if (!success) throw new Error('No se pudo eliminar el cliente')
	}

	/**
	 * Restaurar un cliente eliminado.
	 *
	 * @throws Error si no se pudo restaurar.
	 */
	static async restaurarCliente(userId: User['id'], clienteDNI: Client['dni']) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.restoreByDni(clienteDNI)

		if (!success) throw new Error('No se pudo restaurar el cliente')
	}

	/**
	 * Modificar un cliente.
	 *
	 * @throws Error si no se pudo modificar.
	 */
	static async modificarCliente(
		userId: User['id'],
		clienteDNI: Client['dni'],
		datosActualizados: Partial<ClienteAdaptado>
	) {
		const clerk = await clerkClient()

		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador')
			throw new Error('El usuario debe ser administrador')

		const client = await Client.getByDni(clienteDNI)

		if (!client) throw new Error('Cliente no encontrado')

		const success = await Client.updateByDni(clienteDNI, datosActualizados)

		if (!success) throw new Error('No se pudo modificar el cliente')
	}

	/**
	 * Registrar un cliente.
	 *
	 * @returns Datos del cliente.
	 * @throws Error si no se pudo registrar.
	 */
	static async registrarCliente(
		userId: User['id'],
		datos: Partial<ClienteAdaptado>
	) {
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
	}

	/**
	 * Verificar los datos del cliente.
	 *
	 * @param datos Datos del cliente
	 * @returns Verdadero si los datos son validos.
	 */
	static async verificarCliente(datos: Partial<ClienteAdaptado>) {
		return Client.validarCliente(datos)
	}
}

export default Cliente
