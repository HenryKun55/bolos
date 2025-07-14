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
  const { mutateAsync } = useCreateProduct()

  const { control, handleSubmit, watch, reset, getValues } = useForm<FormData>({
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
    <View className="flex-1">
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
        twClassNameView="px-4"
      >
        <View className="p-6 h-[600px] justify-center rounded-lg bg-white">
          <Text className="text-2xl font-bold text-stone-800 mb-6">
            Adicionar novo produto
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          >
            <Pressable onPress={Keyboard.dismiss}>
              <View className="w-full gap-5">
                <View className="w-full items-center">
                  {watch('image').length ? (
                    <Image
                      className="w-20 h-20 rounded-full"
                      source={getValues().image}
                      cachePolicy="none"
                    />
                  ) : (
                    <Feather name="image" size={80} color="gray" />
                  )}
                </View>

                <View className="w-full">
                  <InputForm
                    control={control}
                    name="image"
                    inputProps={{
                      label: 'Url da imagem',
                      testID: 'input-url-image',
                    }}
                  />
                </View>

                <View className="w-full">
                  <InputForm
                    control={control}
                    name="name"
                    inputProps={{
                      label: 'Nome',
                      testID: 'input-name',
                    }}
                  />
                </View>

                <View className="w-full">
                  <InputForm
                    control={control}
                    name="purchasePrice"
                    inputProps={{
                      label: 'Preço de compra',
                      keyboardType: 'numeric',
                      testID: 'input-purchase-price',
                    }}
                  />
                </View>

                <View className="w-full">
                  <InputForm
                    control={control}
                    name="salesPrice"
                    inputProps={{
                      label: 'Preço de venda',
                      keyboardType: 'numeric',
                      testID: 'input-sales-price',
                    }}
                  />
                </View>
              </View>

              <View className="gap-4 mt-3 py-6">
                <TouchableOpacity
                  className="p-4 rounded border border-blue-300 bg-blue-200"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-white text-center">Criar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-4 bg-gray-300 rounded"
                  onPress={() => createFakeProdut()}
                >
                  <Text className="text-gray-900 text-center">Criar Fake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-4 rounded "
                  onPress={() => handleDismissModal()}
                >
                  <Text className="text-red-400 text-center">Fechar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </CustomModal>
    </View>
  )
}
