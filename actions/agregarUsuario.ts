'use server'

import Usuario, { userSchema } from '@/recursos/usuarios/modelo'
import { z } from 'zod'

export default async function agregarUsuario(
	usuario: z.infer<typeof userSchema>
) {
	const esValido = Usuario.verificarUsuario(usuario)

	if (!esValido) throw new Error('Los datos del usuario no son validos')

	return await Usuario.registrarUsuario(usuario)
}
