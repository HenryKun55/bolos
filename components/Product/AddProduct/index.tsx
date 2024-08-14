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
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather'
import { useCreateProduct } from '@/database/api/products'
import { faker } from '@faker-js/faker'

export const AddProduct = () => {
  const [show, setShow] = useState(false)
  const { mutateAsync } = useCreateProduct()

  const { control, handleSubmit, watch, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      image: '',
      purchasePrice: 0,
      salesPrice: 0,
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutateAsync(data)
      .then(() => {
        Alert.alert('Produto criado.')
        setShow(false)
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
          Adicionar produto
        </Text>
      </TouchableOpacity>
      <Modal
        isVisible={show}
        avoidKeyboard
        onBackdropPress={() => handleDismissModal()}
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View className="bg-gray-600 p-4 rounded-lg">
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text className="text-3xl font-Nunito_700Black text-white mb-5">
                Criar produto
              </Text>
              <View className="gap-5">
                <View>
                  {watch('image').length ? (
                    <Image
                      className="w-20 h-20 rounded-full"
                      source={getValues().image}
                      cachePolicy="none"
                    />
                  ) : (
                    <Feather name="upload" size={80} color="white" />
                  )}
                  <InputForm
                    control={control}
                    name="image"
                    inputProps={{
                      label: 'Url da imagem',
                      testID: 'input-url-image',
                    }}
                  />
                </View>
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
                <View>
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
                <View>
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
              <View className="gap-4 py-6">
                <TouchableOpacity
                  className="p-4 rounded border border-white"
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
                  className="p-4 rounded"
                  onPress={() => setShow(false)}
                >
                  <Text className="text-white text-center">Fechar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
