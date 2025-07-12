import {
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormData } from './validator'
import { useCreateClient } from '@/database/api/clients'
import { CustomModal } from '@/components/Modal'
import { Feather } from '@expo/vector-icons'

export const AddClient = () => {
  const [isModalVisible, setModalVisible] = useState(false)
  const { mutateAsync: createClient, isPending } = useCreateClient()

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  const openModal = () => {
    reset()
    setModalVisible(true)
  }

  const closeModal = () => {
    Keyboard.dismiss()
    setModalVisible(false)
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await createClient(data, {
      onSuccess: () => {
        console.log('Cliente criado com sucesso!')
        closeModal()
      },
      onError: (error) => {
        console.error('Ocorreu um erro:', error)
      },
    })
  }

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="absolute bottom-6 right-6 bg-sky-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <CustomModal isVisible={isModalVisible} onClose={closeModal}>
        <View className="p-5 pt-2">
          <Text className="text-2xl font-bold text-stone-800 mb-6">
            Adicionar Novo Cliente
          </Text>

          <InputForm
            control={control}
            name="name"
            inputProps={{
              label: 'Nome do Cliente',
              placeholder: 'Ex: Maria da Silva',
            }}
          />

          <View className="flex-row gap-3 mt-8">
            <TouchableOpacity
              onPress={closeModal}
              className="flex-1 p-4 bg-stone-200 rounded-lg"
            >
              <Text className="text-center font-bold text-stone-700">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex-1 p-4 bg-sky-500 rounded-lg flex-row justify-center items-center"
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-bold text-white">Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </>
  )
}
