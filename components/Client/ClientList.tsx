import { FlatList, TouchableOpacity, View, Text, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useDeleteClient, useFetchClients } from '@/database/api/clients'
import { EditClient } from './EditClient'
import { EditClienttRequest } from '@/database/api/clients/types'
import { useState } from 'react'

export const ClientList = () => {
  const { data } = useFetchClients()
  const { mutateAsync } = useDeleteClient()

  const [show, setShow] = useState(false)
  const [client, setClient] = useState<EditClienttRequest | undefined>(
    undefined
  )

  const handleEdit = (input: EditClienttRequest) => {
    setClient(input)
    setShow(true)
  }

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
    <>
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
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <View className="gap-4 flex-row items-center">
              <Text className="text-white text-2xl mr-auto">{item.name}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Feather name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <EditClient
        show={show}
        setShow={setShow}
        client={client}
        setClient={setClient}
      />
    </>
  )
}
