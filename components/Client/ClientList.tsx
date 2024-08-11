import { FlatList, TouchableOpacity, View, Text, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useDeleteClient, useFetchClients } from '@/database/api/clients'

export const ClientList = () => {
  const { data } = useFetchClients()
  const { mutateAsync } = useDeleteClient()

  const handleDelete = (clientId: string) => {
    Alert.alert('Deletar', 'Remover cliente?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on remove product'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => {
          mutateAsync(clientId).then(() => {
            console.log('Client: ' + clientId + ' deleted.')
          })
        },
      },
    ])
  }

  return (
    <FlatList
      className="flex-1 p-5"
      data={data}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={
        <View>
          <Text className="text-white text-center">Sem clientes</Text>
        </View>
      }
      ListFooterComponent={<View className="h-10" />}
      renderItem={({ item }) => (
        <View className="gap-4 flex-row items-center">
          <Text className="text-white text-2xl mr-auto">{item.name}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Feather name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    />
  )
}
