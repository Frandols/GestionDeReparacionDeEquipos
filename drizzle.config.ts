// drizzle.config.ts
import { config } from '@/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './db/schema.ts',
	dbCredentials: {
		url: config.DATABASE_URL,
	},
})
