import { obtenerUsuarios } from '@/actions/obtenerUsuarios'
import VistaAdministrarUsuarios from './vista'

export default async function ControladorAdministrarUsuarios() {
	const usuarios = await obtenerUsuarios()

	return VistaAdministrarUsuarios(usuarios)
}
