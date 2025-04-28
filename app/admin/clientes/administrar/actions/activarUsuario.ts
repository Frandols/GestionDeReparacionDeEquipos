'use server'

import { clerkClient, User } from '@clerk/nextjs/server'

export default async function activarUsuario(id: User['id']) {
	const clerk = await clerkClient()

	await clerk.users.unlockUser(id)
}
