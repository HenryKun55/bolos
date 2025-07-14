import { FlatList, TouchableOpacity, View, Text, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useDeleteClient, useFetchClients } from '@/database/api/clients'
import { EditClient } from './EditClient'
import { EditClienttRequest } from '@/database/api/clients/types'
import { useState } from 'react'
import { CustomModal } from '@/components/Modal'

export const ClientList = () => {
  const { data: clients } = useFetchClients()
  const { mutate: deleteClient } = useDeleteClient()

  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedClient, setSelectedClient] = useState<
    EditClienttRequest | undefined
  >(undefined)

  const openEditModal = (client: EditClienttRequest) => {
    setSelectedClient(client)
    setEditModalVisible(true)
  }

  const closeEditModal = () => {
    setSelectedClient(undefined)
    setEditModalVisible(false)
  }

  const openDeleteModal = (client: EditClienttRequest) => {
    setSelectedClient(client)
    setDeleteModalVisible(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id, {
        onSuccess: () => {
          console.log(`Client ${selectedClient.name} deleted.`)
          setDeleteModalVisible(false)
          setSelectedClient(undefined)
        },
      })
    }
  }

  const handleDismissEditModal = () => {
    Alert.alert('Cancelar', 'Cancelar edição de cliente?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on edit client.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => closeEditModal(),
      },
    ])
  }

  return (
    <>
      <FlatList
        data={clients}
        className="pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={<Text>Nenhum cliente por aqui</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl border border-stone-200 flex-row items-center">
            <View className="w-12 h-12 bg-sky-100 rounded-full items-center justify-center mr-4">
              <Feather name="user" size={24} className="text-sky-800" />
            </View>
            <Text className="text-lg font-semibold text-stone-700 mr-auto">
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              className="p-2"
            >
              <Feather name="edit-2" size={20} className="text-stone-500" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openDeleteModal(item)}
              className="p-2"
            >
              <Feather name="trash" size={20} className="text-red-500" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal para Editar Cliente */}
      {selectedClient && (
        <EditClient
          show={isEditModalVisible}
          closeModal={closeEditModal}
          handleDismissModal={handleDismissEditModal}
          client={selectedClient}
          setClient={setSelectedClient}
        />
      )}

      {/* Modal para Confirmar Exclusão */}
      {selectedClient && (
        <CustomModal
          isVisible={isDeleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
        >
          <View className="p-4">
            <Feather
              name="alert-triangle"
              size={40}
              className="text-red-500 text-center mb-4"
            />
            <Text className="text-xl font-bold text-center text-stone-800 mb-2">
              Confirmar Exclusão
            </Text>
            <Text className="text-base text-stone-600 text-center mb-6">
              Você tem certeza que deseja remover{' '}
              <Text className="font-bold">{selectedClient.name}</Text>? Esta
              ação não pode ser desfeita.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 p-3 bg-stone-200 rounded-lg"
              >
                <Text className="text-center font-bold text-stone-700">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteConfirm}
                className="flex-1 p-3 bg-red-500 rounded-lg"
              >
                <Text className="text-center font-bold text-white">
                  Sim, Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      )}
    </>
  )
}
