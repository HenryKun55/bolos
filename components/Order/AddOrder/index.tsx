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
import schema, { FormData } from './validator'
import { useCreateOrder } from '@/database/api/orders'
import { ClientForm } from './ClientForm'
import { ExchangeForm } from './ExchangeForm'

export const AddOrder = () => {
  const [show, setShow] = useState(false)
  const { mutateAsync } = useCreateOrder()

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clients: undefined,
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
    mutateAsync(data)
      .then(() => {
        Alert.alert('Pedido criado')
        setShow(false)
      })
      .catch((error) => Alert.alert('Ocorreu um erro: ' + error))
  }

  const handleDismissModal = () => {
    Alert.alert('Cancelar', 'Cancelar pedido?', [
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
          Adicionar pedido
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={show}
        avoidKeyboard
        onBackdropPress={() => handleDismissModal()}
        className="py-10"
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View className="bg-gray-600 p-4 rounded-lg">
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text className="text-3xl font-Nunito_700Black text-white mb-5">
                Criar pedido
              </Text>

              <ClientForm control={control} />
              <ExchangeForm control={control} />
              <TouchableOpacity
                className="mt-5 border border-white"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="w-full p-4 text-white text-xl text-center">
                  Criar pedido
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
