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
import { Dispatch, SetStateAction, useEffect } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormInputData, FormOutputData } from './validator'
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather'
import { useEditProduct } from '@/database/api/products'
import { EditProductInput } from '../ProductsList'

type EditProductProps = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  product: EditProductInput | undefined
  setProduct: Dispatch<SetStateAction<EditProductInput | undefined>>
}

export const EditProduct = ({
  show,
  setShow,
  product,
  setProduct,
}: EditProductProps) => {
  const { mutateAsync } = useEditProduct()

  const { control, handleSubmit, watch, getValues, reset } = useForm<
    FormInputData,
    any,
    FormOutputData
  >({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormOutputData> = ({
    id,
    name,
    image,
    purchasePrice,
    salesPrice,
  }) => {
    mutateAsync({ id, name, image, purchasePrice, salesPrice })
      .then(() => {
        Alert.alert('Produto editado.')
        setShow(false)
        setProduct(undefined)
      })
      .catch(() => {
        Alert.alert('Ocorreu um erro.')
      })
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

  useEffect(() => {
    reset({
      id: product?.id,
      name: product?.name,
      image: product?.image,
      purchasePrice: String(product?.productPrice[0].purchasePrice),
      salesPrice: String(product?.productPrice[0].salesPrice),
    })
  }, [product?.id])

  return (
    <Modal
      isVisible={show}
      avoidKeyboard
      onBackdropPress={() => handleDismissModal()}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <View className="bg-gray-600 p-4 rounded-lg">
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text className="text-3xl font-Nunito_700Black text-white mb-5">
              Editar produto
            </Text>
            <View className="gap-5">
              <View>
                {watch('image')?.length ? (
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
                <Text className="text-white text-center">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-4 rounded"
                onPress={() => handleDismissModal()}
              >
                <Text className="text-white text-center">Fechar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  )
}
