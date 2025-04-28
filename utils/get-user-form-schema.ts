import { z } from 'zod'

export default function getUserFormSchema(isPasswordOptional: boolean) {
	const password = z
		.string({ message: 'Debe ingresar una contraseña' })
		.max(16, { message: 'La contraseña es demasiado larga' })

	return z.object({
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
		password: isPasswordOptional
			? password
			: password.min(8, { message: 'La contraseña es demasiado corta' }),
		telefono: z
			.string()
			.regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 números'),
		DNI: z.string().regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 números'),
		rol: z
			.string()
			.refine((val) => ['administrador', 'tecnico'].includes(val), {
				message: 'El usuario debe ser administrador o tecnico',
			}),
	})
}
