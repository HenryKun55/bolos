import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  closeModal: () => void
  handleDismissModal: () => void
  client: EditClienttRequest | undefined
  setClient: Dispatch<SetStateAction<EditClienttRequest | undefined>>
}

export const EditClient = ({
  show,
  closeModal,
  handleDismissModal,
  client,
  setClient,
}: EditClientProps) => {
  const { isPending, mutateAsync } = useEditClient()

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutateAsync(data)
      .then(() => {
        Alert.alert('Cliente editado.')
        console.log('Cliente editado com sucesso!', data)
        setClient(undefined)
        closeModal()
      })
      .catch((error) => {
        console.error('Ocorreu um erro ao editar:', error)
        Alert.alert('Ocorreu um erro ao editar: ' + error)
      })
  }

  useEffect(() => {
    reset({ id: client?.id, name: client?.name })
  }, [client?.id])

  return (
    <CustomModal
      isVisible={show}
      onClose={handleDismissModal}
      onBackdropPress={handleDismissModal}
      twClassNameWrapper="px-8"
      twClassNameContent="bg-white"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          <View className="flex-row gap-3 mt-8">
            <TouchableOpacity
              onPress={handleDismissModal}
              className="flex-1 p-4 bg-stone-200 rounded-lg"
            >
              <Text className="text-center font-bold text-stone-700">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
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
      </KeyboardAvoidingView>
    </CustomModal>
  )
}
