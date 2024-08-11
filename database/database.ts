import { useSQLiteContext } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as schema from './schema'

export const useDatabase = () => {
  const database = useSQLiteContext()
  const db = drizzle(database, { schema })

  return db
}
