import Cliente from '../modelo'
import VistaVerClientes from './vista'

export default async function ControladorVerClientes() {
	const clientes = await Cliente.obtenerClientes()

	return VistaVerClientes(clientes)
}
