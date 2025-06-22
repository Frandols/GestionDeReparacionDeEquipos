import getLast10Chars from '@/utils/get-last-10-chars'
import getUserFormSchema from '@/utils/get-user-form-schema'
import {
	clerkClient,
	EmailAddress,
	PhoneNumber,
	User,
} from '@clerk/nextjs/server'
import { z } from 'zod'

export const userSchema = z.object({
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

type ParametrosDeUsuarioActualizado = Parameters<
	Awaited<ReturnType<typeof clerkClient>>['users']['updateUser']
>[1]

/**
 * Modelo del usuario.
 */
class Usuario {
	/**
	 * Verifica que los datos del usuario sean validos.
	 *
	 * @param usuario Datos del usuario.
	 * @returns Verdadero si los datos son validos, falso de lo contrario.
	 */
	static verificarUsuario(usuario: z.infer<typeof userSchema>): boolean {
		const withPassword = usuario.password.length > 0

		const userSchema = getUserFormSchema(!withPassword)

		const resultado = userSchema.safeParse(usuario)

		return resultado.success
	}

	/**
	 * Registra a un usuario.
	 *
	 * @param usuario Datos del usuario
	 * @returns Vacio si la operacion es exitosa, codigo y parametro de error si falla.
	 */
	static async registrarUsuario(usuario: z.infer<typeof userSchema>) {
		const usuarioAdaptado = {
			...usuario,
			DNI: Number(usuario.DNI),
		}

		const clerk = await clerkClient()

		const currentUsers = await clerk.users.getUserList()

		if (
			currentUsers.data.some(
				(currentUser) => currentUser.publicMetadata.DNI === usuarioAdaptado.DNI
			)
		)
			return {
				code: 'form_identifier_exists',
				param: 'DNI',
			}

		try {
			await clerk.users.createUser({
				firstName: usuarioAdaptado.nombre,
				lastName: usuarioAdaptado.apellido,
				emailAddress: [usuarioAdaptado.email],
				phoneNumber: [`+54${usuarioAdaptado.telefono}`],
				username: usuarioAdaptado.nombreDeUsuario,
				password: usuarioAdaptado.password,
				publicMetadata: {
					DNI: usuarioAdaptado.DNI,
					role: usuarioAdaptado.rol,
				},
			})
		} catch (error: unknown) {
			const info = (
				error as { errors: [{ code: string; meta: { paramName: string } }] }
			).errors[0]

			return {
				code: info.code,
				param: info.meta.paramName,
			}
		}
	}

	static async modificarUsuario(
		id: User['id'],
		actualizacion: z.infer<ReturnType<typeof getUserFormSchema>>
	) {
		const usuarioAdaptado = {
			...actualizacion,
			telefono: `+54${actualizacion.telefono}`,
			DNI: Number(actualizacion.DNI),
		}

		const clerk = await clerkClient()

		const currentUsers = await clerk.users.getUserList()

		if (
			currentUsers.data.some(
				(currentUser) =>
					currentUser.publicMetadata.DNI === usuarioAdaptado.DNI &&
					currentUser.primaryEmailAddress?.emailAddress !==
						usuarioAdaptado.email
			)
		)
			return {
				code: 'form_identifier_exists',
				param: 'DNI',
			}

		const payload: ParametrosDeUsuarioActualizado = {
			firstName: usuarioAdaptado.nombre,
			lastName: usuarioAdaptado.apellido,
			username: usuarioAdaptado.nombreDeUsuario,
			publicMetadata: {
				DNI: usuarioAdaptado.DNI,
				role: usuarioAdaptado.rol,
			},
		}

		if (actualizacion.password.length > 0) {
			payload.password = usuarioAdaptado.password
		}

		const {
			primaryEmailAddress,
			primaryPhoneNumber,
			emailAddresses,
			phoneNumbers,
		} = await clerk.users.getUser(id)

		if (
			primaryEmailAddress !== null &&
			primaryEmailAddress.emailAddress !== usuarioAdaptado.email
		) {
			if (
				emailAddresses.some(
					(emailAddress) => emailAddress.emailAddress === usuarioAdaptado.email
				)
			) {
				const newPrimaryEmailAddress = emailAddresses.find(
					(emailAddress) => emailAddress.emailAddress === usuarioAdaptado.email
				) as EmailAddress

				await clerk.emailAddresses.updateEmailAddress(
					newPrimaryEmailAddress.id,
					{
						primary: true,
					}
				)
			} else {
				const newPrimaryEmailAddress =
					await clerk.emailAddresses.createEmailAddress({
						userId: id,
						emailAddress: usuarioAdaptado.email,
					})

				await clerk.emailAddresses.updateEmailAddress(
					newPrimaryEmailAddress.id,
					{
						primary: true,
					}
				)
			}
		}

		if (
			primaryPhoneNumber !== null &&
			primaryPhoneNumber.phoneNumber !== usuarioAdaptado.telefono
		) {
			if (
				phoneNumbers.some(
					(phoneNumber) => phoneNumber.phoneNumber === usuarioAdaptado.telefono
				)
			) {
				const newPrimaryPhoneNumber = phoneNumbers.find(
					(phoneNumber) => phoneNumber.phoneNumber === usuarioAdaptado.telefono
				) as PhoneNumber

				await clerk.phoneNumbers.updatePhoneNumber(newPrimaryPhoneNumber.id, {
					primary: true,
				})
			} else {
				const newPrimaryPhoneNumber =
					await clerk.phoneNumbers.createPhoneNumber({
						userId: id,
						phoneNumber: usuarioAdaptado.telefono,
					})

				await clerk.phoneNumbers.updatePhoneNumber(newPrimaryPhoneNumber.id, {
					primary: true,
				})
			}
		}

		try {
			await clerk.users.updateUser(id, payload)
		} catch (error: unknown) {
			const info = (
				error as { errors: [{ code: string; meta: { paramName: string } }] }
			).errors[0]

			return {
				code: info.code,
				param: info.meta.paramName,
			}
		}
	}

	/**
	 * Obtener la lista completa de usuarios.
	 *
	 * @returns Lista de usuarios.
	 */
	static async obtenerUsuarios() {
		const client = await clerkClient()

		const users = await client.users.getUserList()

		const adaptedUsers = users.data.map((user) => ({
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email:
				user.primaryEmailAddress?.emailAddress ??
				user.emailAddresses[0].emailAddress,
			username: user.username,
			phoneNumber: getLast10Chars(
				user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0].phoneNumber
			),
			DNI: user.publicMetadata.DNI as string,
			role: user.publicMetadata.role as string,
			deleted: user.locked,
		}))

		return adaptedUsers
	}

	/**
	 * Eliminar un usuario.
	 *
	 * @param id ID del usuario.
	 */
	static async eliminarUsuario(id: User['id']) {
		const clerk = await clerkClient()

		await clerk.users.lockUser(id)
	}

	/**
	 * Activar un usuario eliminado.
	 *
	 * @param id ID del usuario.
	 */
	static async activarUsuario(id: User['id']) {
		const clerk = await clerkClient()

		await clerk.users.unlockUser(id)
	}
}

export default Usuario
