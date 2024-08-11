import { AddClient } from '@/components/Client/AddClient'
import { ClientList } from '@/components/Client/ClientList'
import { SafeAreaView } from 'react-native'

const Clients = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <ClientList />
      <AddClient />
    </SafeAreaView>
  )
}

export default Clients
