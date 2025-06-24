import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const roleRouteMap: Record<string, string[]> = {
	maestro: [
		'/',
		'/usuarios/agregar',
		'/usuarios/administrar',
		'/clientes/ver',
		'/equipos/ver',
	],
	administrador: [
		'/',
		'/clientes/agregar',
		'/clientes/administrar',
		'/equipos/agregar',
		'/equipos/administrar',
	],
	tecnico: ['/', '/equipos/administrar'],
}

const allRoutes = Array.from(new Set(Object.values(roleRouteMap).flat()))

const isPublicRoute = createRouteMatcher([
	'/login(.*)',
	'/formCliente',
	'/api/clientes',
	'/listarClientes',
	'/editarCliente(/.*)?',
	'/api(/.*)',
	'/admin(/.*)',
	'/admin/clientes(/.*)',
	'/admin/equipos(/.*)',
	'/api/equipos',
])

const userWithRoleSchema = z.object({
	role: z.enum(['administrador', 'tecnico', 'maestro']),
})

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect()
	}

	const pathname = req.nextUrl.pathname

	if (!allRoutes.includes(pathname)) return

	const { userId } = await auth()

	if (!userId) {
		await auth.protect()

		return
	}

	const clerk = await clerkClient()

	const userData = await clerk.users.getUser(userId)

	const metadataParse = userWithRoleSchema.safeParse(userData.publicMetadata)

	const url = req.nextUrl.clone()

	url.pathname = '/'

	if (!metadataParse.success) {
		return NextResponse.redirect(url)
	}

	const role = metadataParse.data.role

	if (!role || !roleRouteMap[role]) {
		// Sin rol o rol desconocido → redirigir
		return NextResponse.redirect(url)
	}

	// Si la ruta actual no está en la lista de rutas permitidas para este rol
	const allowedRoutes = roleRouteMap[role]

	if (!allowedRoutes.includes(pathname)) {
		return NextResponse.redirect(url)
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
