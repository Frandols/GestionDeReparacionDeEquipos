'use server'

import { clerkClient, User } from '@clerk/nextjs/server'

export default async function eliminarUsuario(id: User['id']) {
	const clerk = await clerkClient()

	await clerk.users.lockUser(id)
}
