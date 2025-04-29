'use server'

import getLast10Chars from '@/utils/get-last-10-chars'
import { clerkClient } from '@clerk/nextjs/server'

export async function obtenerUsuarios() {
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
