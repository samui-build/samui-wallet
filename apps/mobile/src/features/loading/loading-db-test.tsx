import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { db } from '../../db/db.ts'
import migrations from '../../db/drizzle/migrations.js'
import { type Network, networksTable } from '../../db/schema.ts'

export function LoadingDbTest() {
  const { success, error } = useMigrations(db, migrations)
  const [items, setItems] = useState<Network[] | null>(null)

  async function doSomething() {
    console.log('do something')
    try {
      const deleted = await db.delete(networksTable)
      console.log('deleted', deleted)
    } catch (e) {
      console.log('deleted err', e)
    }

    try {
      const inserted = await db.insert(networksTable).values([
        {
          endpoint: 'https://api.devnet.solana.com',
          name: 'Devnet',
          type: 'solana:devnet',
        },
      ])
      console.log('inserted', inserted)
    } catch (e) {
      console.log('inserted err', e)
    }

    const items = await db.select().from(networksTable)
    console.log('items', items)
    setItems(items)
  }

  if (error) {
    return (
      <View>
        <Text className="text-neutral-900 dark:text-neutral-100">Migration error: {error.message}</Text>
      </View>
    )
  }

  if (!success) {
    return (
      <View>
        <Text className="text-neutral-900 dark:text-neutral-100">Migration is in progress...</Text>
      </View>
    )
  }

  if (items === null || items.length === 0) {
    return (
      <View>
        <Text className="text-neutral-900 dark:text-neutral-100">Empty</Text>
        <TouchableOpacity onPress={() => doSomething()}>
          <Text className="text-neutral-900 dark:text-neutral-100">Do Something</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {items.map((item) => (
        <View key={item.id}>
          <Text className="text-neutral-900 dark:text-neutral-100">{item.name}</Text>
          <Text className="text-neutral-900 dark:text-neutral-100">{JSON.stringify(item, null, 2)}</Text>
        </View>
      ))}
    </View>
  )
}
