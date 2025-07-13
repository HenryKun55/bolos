import { AnimatedHeader } from '@/components/AnimatedHeader'
import { AddClient } from '@/components/Client/AddClient'
import { ClientList } from '@/components/Client/ClientList'
import { SafeAreaView, View } from 'react-native'

const Clients = () => {
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="flex-1 p-6">
        <AnimatedHeader title="Clientes" />
        <ClientList />
        <AddClient />
      </View>
    </SafeAreaView>
  )
}

export default Clients
