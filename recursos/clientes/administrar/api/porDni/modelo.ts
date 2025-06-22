import { Client, ClienteAdaptado } from '@/respositorios/client'
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
		datosActualizados: Partial<ClienteAdaptado>
	) {
		const clerk = await clerkClient()
		const userData = await clerk.users.getUser(userId)

		if (userData.publicMetadata.role !== 'administrador') {
			throw new Error('El usuario debe ser administrador')
		}

		const clienteExistente = await Client.getByDni(clienteDNI)
		if (!clienteExistente) throw new Error('Cliente no encontrado')

		const clienteEditado = Client.create(datosActualizados)
		if (clienteEditado instanceof Error) {
			switch (clienteEditado.message) {
				case 'FALTAN_CAMPOS':
					throw new Error('Faltan campos por completar')
				case 'DNI_INVALIDO':
					throw new Error('El DNI ingresado no es válido.')
				case 'EMAIL_INVALIDO':
					throw new Error('El correo electrónico no es válido.')
				case 'PHONE_INVALIDO':
					throw new Error('El número de teléfono no es válido.')
				default:
					throw new Error('No se pudo procesar el cliente')
			}
		}

		// Verificamos si el nuevo DNI está en uso por otro cliente
		if (datosActualizados.dni && datosActualizados.dni !== clienteDNI) {
			const dniEnUso = await Client.getByDni(datosActualizados.dni)
			if (dniEnUso) {
				throw new Error('Ya existe otro cliente con ese DNI')
			}
		}

		try {
			const success = await Client.updateByDni(clienteDNI, datosActualizados)
			if (!success) throw new Error('No se pudo modificar el cliente')
		} catch (error) {
			if (error instanceof Error) throw new Error(error.message)
			throw new Error('Error desconocido al modificar cliente')
		}

		return true
	}

}

export default modeloAdministrarClientes
