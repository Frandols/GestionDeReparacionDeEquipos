'use server'

import getUserFormSchema from '@/utils/get-user-form-schema'
import {
	clerkClient,
	EmailAddress,
	PhoneNumber,
	User,
} from '@clerk/nextjs/server'
import { z } from 'zod'

type UpdatedUserParams = Parameters<
	Awaited<ReturnType<typeof clerkClient>>['users']['updateUser']
>[1]

export default async function editarUsuario(
	id: User['id'],
	updatedUser: z.infer<ReturnType<typeof getUserFormSchema>>
) {
	const withPassword = updatedUser.password.length > 0

	const userSchema = getUserFormSchema(!withPassword)

	const validationResult = userSchema.safeParse(updatedUser)

	if (!validationResult.success) throw validationResult.error

	const usuarioAdaptado = {
		...updatedUser,
		telefono: `+54${updatedUser.telefono}`,
		DNI: Number(updatedUser.DNI),
	}

	const clerk = await clerkClient()

	const currentUsers = await clerk.users.getUserList()

	if (
		currentUsers.data.some(
			(currentUser) =>
				currentUser.publicMetadata.DNI === usuarioAdaptado.DNI &&
				currentUser.primaryEmailAddress?.emailAddress !== usuarioAdaptado.email
		)
	)
		return {
			code: 'form_identifier_exists',
			param: 'DNI',
		}

	const payload: UpdatedUserParams = {
		firstName: usuarioAdaptado.nombre,
		lastName: usuarioAdaptado.apellido,
		username: usuarioAdaptado.nombreDeUsuario,
		publicMetadata: {
			DNI: usuarioAdaptado.DNI,
			role: usuarioAdaptado.rol,
		},
	}

	if (withPassword) {
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

			await clerk.emailAddresses.updateEmailAddress(newPrimaryEmailAddress.id, {
				primary: true,
			})
		} else {
			const newPrimaryEmailAddress =
				await clerk.emailAddresses.createEmailAddress({
					userId: id,
					emailAddress: usuarioAdaptado.email,
				})

			await clerk.emailAddresses.updateEmailAddress(newPrimaryEmailAddress.id, {
				primary: true,
			})
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
			const newPrimaryPhoneNumber = await clerk.phoneNumbers.createPhoneNumber({
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
