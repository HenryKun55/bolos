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
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormData } from './validator'
import { useEditClient } from '@/database/api/clients'
import { EditClienttRequest } from '@/database/api/clients/types'

type EditClientProps = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  client: EditClienttRequest | undefined
  setClient: Dispatch<SetStateAction<EditClienttRequest | undefined>>
}

export const EditClient = ({
  show,
  setShow,
  client,
  setClient,
}: EditClientProps) => {
  const { mutateAsync } = useEditClient()

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutateAsync(data)
      .then(() => {
        Alert.alert('Cliente editado.')
        setClient(undefined)
        setShow(false)
      })
      .catch(() => {
        Alert.alert('Ocorreu um erro.')
      })
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

  useEffect(() => {
    reset({ id: client?.id, name: client?.name })
  }, [client?.id])

  return (
    <Modal
      avoidKeyboard
      isVisible={show}
      onBackdropPress={() => handleDismissModal()}
      testID="modal-backdrop"
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View className="bg-gray-600 p-4 rounded-lg">
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text className="text-3xl font-Nunito_700Black text-white mb-5">
              Editar cliente
            </Text>
            <View>
              <InputForm
                control={control}
                name="name"
                inputProps={{
                  label: 'Nome',
                  testID: 'input-name',
                }}
              />
            </View>
            <View className="gap-4 py-6">
              <TouchableOpacity
                className="p-4 rounded border border-white"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white text-center">Editar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  )
}
