import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from 'react-native-modal'
import { useState } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormData } from './validator'
import { useCreateClient } from '@/database/api/clients'
import { faker } from '@faker-js/faker'

export const AddClient = () => {
  const [show, setShow] = useState(false)
  const { mutateAsync } = useCreateClient()

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutateAsync(data)
      .then(() => {
        Alert.alert('Cliente criado.')
        setShow(false)
      })
      .catch(() => {
        Alert.alert('Ocorreu um erro.')
      })
  }

  const createFakeClient = () => {
    mutateAsync({
      name: faker.person.fullName(),
    })
    Alert.alert('Cliente criado.')
  }

  const handleDismissModal = () => {
    Alert.alert('Cancelar', 'Cancelar cliente?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on create order.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => {
          Keyboard.dismiss()
          setShow(false)
        },
      },
    ])
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text className="w-full p-4 text-white text-xl bg-sky-500 text-center">
          Adicionar cliente
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={show}
        avoidKeyboard
        onBackdropPress={() => handleDismissModal()}
        testID="modal-backdrop"
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View className="bg-gray-600 p-4 rounded-lg">
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text className="text-3xl font-Nunito_700Black text-white mb-5">
                Criar cliente
              </Text>
              <View>
                <InputForm
                  control={control}
                  name="name"
                  inputProps={{
                    label: 'Nome',
                  }}
                />
              </View>
              <View className="gap-4 py-6">
                <TouchableOpacity
                  className="p-4 rounded border border-white"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-white text-center">Criar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-4 bg-gray-300 rounded"
                  onPress={() => createFakeClient()}
                >
                  <Text className="text-gray-900 text-center">Criar Fake</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
