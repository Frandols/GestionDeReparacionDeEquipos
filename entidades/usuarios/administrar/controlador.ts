import modeloAdministrarUsuarios from './modelo'
import VistaAdministrarUsuarios from './vista'

export default async function ControladorAdministrarUsuarios() {
	const usuarios = await modeloAdministrarUsuarios.obtenerUsuarios()

	return VistaAdministrarUsuarios(usuarios)
}
