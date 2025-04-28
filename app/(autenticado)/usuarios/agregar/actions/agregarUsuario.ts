'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'

const userSchema = z.object({
	nombre: z
		.string({ message: 'Debe ingresar un nombre' })
		.min(4, { message: 'El nombre es demasiado corto' }),
	apellido: z
		.string({ message: 'Debe ingresar un apellido' })
		.min(4, { message: 'El apellido es demasiado corto' }),
	email: z
		.string({ message: 'Debe ingresar una direccion de correo electronico' })
		.email({ message: 'La direccion de correo no es valida' }),
	nombreDeUsuario: z
		.string({ message: 'Debe ingresar un nombre de usuario' })
		.min(4, { message: 'El nombre de usuario es demasiado corto' }),
	password: z
		.string({ message: 'Debe ingresar una contraseña' })
		.min(8, { message: 'La contraseña es demasiado corta' })
		.max(16, { message: 'La contraseña es demasiado larga' }),
	telefono: z
		.string()
		.regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 números'),
	DNI: z.string().regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 números'),
	rol: z.string().refine((val) => ['administrador', 'tecnico'].includes(val), {
		message: 'El usuario debe ser administrador o tecnico',
	}),
})

export default async function agregarUsuario(
	usuario: z.infer<typeof userSchema>
) {
	const validationResult = userSchema.safeParse(usuario)

	if (!validationResult.success) throw validationResult.error

	const usuarioAdaptado = {
		...usuario,
		DNI: Number(usuario.telefono),
	}

	const clerk = await clerkClient()

	await clerk.users
		.createUser({
			firstName: usuarioAdaptado.nombre,
			lastName: usuarioAdaptado.apellido,
			emailAddress: [usuarioAdaptado.email],
			phoneNumber: [usuarioAdaptado.telefono],
			username: usuarioAdaptado.nombreDeUsuario,
			password: usuarioAdaptado.password,
			publicMetadata: {
				DNI: usuarioAdaptado.DNI,
				role: usuarioAdaptado.rol,
			},
		})
		.catch((error) => console.log(error.toString()))
}
