'use server'

import Usuario from '@/recursos/usuarios/modelo'
import getUserFormSchema from '@/utils/get-user-form-schema'
import { User } from '@clerk/nextjs/server'
import { z } from 'zod'

export default async function editarUsuario(
	id: User['id'],
	updatedUser: z.infer<ReturnType<typeof getUserFormSchema>>
) {
	const esValido = Usuario.verificarUsuario(updatedUser)

	if (!esValido) throw new Error('Los datos del usuario no son validos')

	return await Usuario.modificarUsuario(id, updatedUser)
}
