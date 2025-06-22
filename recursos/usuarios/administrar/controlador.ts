import Usuario from '../modelo'
import VistaAdministrarUsuarios from './vista'

export default async function ControladorAdministrarUsuarios() {
	const usuarios = await Usuario.obtenerUsuarios()

	return VistaAdministrarUsuarios(usuarios)
}
