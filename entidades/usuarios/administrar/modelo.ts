import { obtenerUsuarios } from '@/actions/obtenerUsuarios'

const modeloAdministrarUsuarios = {
	obtenerUsuarios: async () => {
		const users = await obtenerUsuarios()

		return users
	},
}

export default modeloAdministrarUsuarios
