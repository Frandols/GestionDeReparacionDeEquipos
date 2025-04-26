import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success)
	throw new Error(`Error en las variables de entorno: ${parsed.error.format()}`)

export const config = parsed.data
