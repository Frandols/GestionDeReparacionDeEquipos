import { config } from '@/config'
import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(config.DATABASE_URL)

export default db
