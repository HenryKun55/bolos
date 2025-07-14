import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormData } from './validator'
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather'
import { useCreateProduct } from '@/database/api/products'
import { faker } from '@faker-js/faker'
import { CustomModal } from '@/components/Modal'

export const AddProduct = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { mutateAsync, isPending } = useCreateProduct()

  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      image: '',
      purchasePrice: 0,
      salesPrice: 0,
    },
  })

  const openModal = () => {
    reset()
    setIsModalVisible(true)
  }

  const closeModal = () => {
    Keyboard.dismiss()
    setIsModalVisible(false)
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutateAsync(data)
      .then(() => {
        Alert.alert('Produto criado.')
        closeModal()
      })
      .catch(() => {
        Alert.alert('Ocorreu um erro.')
      })
  }

  const createFakeProdut = () => {
    const purchasePrice = Number(faker.commerce.price({ max: 10 }))
    mutateAsync({
      image: faker.image.url(),
      purchasePrice,
      salesPrice: purchasePrice + 2,
      name: faker.commerce.product(),
    })
    Alert.alert('Produto criado.')
  }

  const handleDismissModal = () => {
    Alert.alert('Cancelar', 'Cancelar produto?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on create product.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => closeModal(),
      },
    ])
  }

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="absolute bottom-6 right-6 bg-sky-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <CustomModal
        isVisible={isModalVisible}
        onClose={handleDismissModal}
        onBackdropPress={handleDismissModal}
        twClassNameWrapper="px-8"
        twClassNameContent="bg-white max-h-[80%] overflow-hidden"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className="p-6">
            <Text className="text-2xl font-bold text-stone-800 mb-6">
              Adicionar Novo Produto
            </Text>

            <ScrollView
              contentContainerStyle={{
                paddingBlockEnd: 150,
              }}
            >
              <Pressable onPress={Keyboard.dismiss}>
                <View className="items-center mb-4">
                  {watch('image') ? (
                    <Image
                      source={{ uri: watch('image') }}
                      className="w-40 h-40 rounded-full"
                    />
                  ) : (
                    <View className="w-40 h-40 rounded-lg bg-stone-100 items-center justify-center">
                      <Feather
                        name="image"
                        size={40}
                        className="text-stone-400"
                      />
                    </View>
                  )}
                </View>

                <InputForm
                  control={control}
                  name="image"
                  inputProps={{
                    label: 'URL da Imagem',
                    style: { marginBottom: 12 },
                  }}
                />

                <InputForm
                  control={control}
                  name="name"
                  inputProps={{
                    label: 'Nome do Produto',
                    style: { marginBottom: 12 },
                  }}
                />

                <InputForm
                  control={control}
                  name="purchasePrice"
                  inputProps={{
                    label: 'Preço de compra',
                    keyboardType: 'numeric',
                    style: { marginBottom: 12 },
                  }}
                />

                <InputForm
                  control={control}
                  name="salesPrice"
                  inputProps={{
                    label: 'Preço de venda',
                    keyboardType: 'numeric',
                  }}
                />

                <View className="flex-row mt-8 justify-between">
                  <TouchableOpacity
                    onPress={handleDismissModal}
                    className="w-[48%] p-4 bg-stone-200 rounded-lg"
                  >
                    <Text className="text-center font-bold text-stone-700">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    className="w-[48%] p-4 bg-sky-500 rounded-lg flex-row justify-center items-center"
                  >
                    {isPending ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-center font-bold text-white">
                        Salvar
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={createFakeProdut}
                  className="p-4 bg-green-500 rounded-lg mt-4"
                >
                  <Text className="text-center font-bold text-white">
                    Criar produto fake
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </CustomModal>
    </>
  )
}
