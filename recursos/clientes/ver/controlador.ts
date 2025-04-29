import modeloVerClientes from './modelo'
import VistaVerClientes from './vista'

export default async function ControladorVerClientes() {
	const clientes = await modeloVerClientes.obtenerClientes()

	return VistaVerClientes(clientes)
}
