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
import { Dispatch, SetStateAction, useEffect } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormData } from './validator'
import { useEditClient } from '@/database/api/clients'
import { EditClienttRequest } from '@/database/api/clients/types'
import { CustomModal } from '@/components/Modal'

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
        onPress: () => console.log('Cancel Pressed on create client.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => setShow(false),
      },
    ])
  }

  useEffect(() => {
    reset({ id: client?.id, name: client?.name })
  }, [client?.id])

  return (
    <CustomModal
      isVisible={show}
      onClose={handleDismissModal}
      onBackdropPress={handleDismissModal}
    >
      <View className="p-6">
        <Text className="text-2xl font-bold text-stone-800 mb-6">
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
      </View>
    </CustomModal>
  )
}
