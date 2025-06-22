'use server'

import Usuario from '@/recursos/usuarios/modelo'
import { User } from '@clerk/nextjs/server'

export default async function eliminarUsuario(id: User['id']) {
	await Usuario.eliminarUsuario(id)
}
