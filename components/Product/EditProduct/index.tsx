import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { InputForm } from '@/components/Input'
import schema, { FormInputData, FormOutputData } from './validator'
import { Image } from 'expo-image'
import Feather from '@expo/vector-icons/Feather'
import { useEditProduct } from '@/database/api/products'
import { CustomModal } from '@/components/Modal'
import { ProductWithPrice } from '@/@types/product'

type EditProductProps = {
  show: boolean
  closeModal: () => void
  handleDismissModal: () => void
  product: ProductWithPrice | undefined
  setProduct: Dispatch<SetStateAction<ProductWithPrice | undefined>>
}

export const EditProduct = ({
  show,
  closeModal,
  handleDismissModal,
  product,
  setProduct,
}: EditProductProps) => {
  const { mutateAsync: editProduct, isPending } = useEditProduct()

  const { control, handleSubmit, watch, reset } = useForm<
    FormInputData,
    any,
    FormOutputData
  >({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (product) {
      reset({
        id: product.id,
        name: product.name,
        image: product.image,
        purchasePrice: String(product.productPrice[0]?.purchasePrice ?? 0),
        salesPrice: String(product.productPrice[0]?.salesPrice ?? 0),
      })
    }
  }, [product, reset])

  const onSubmit: SubmitHandler<FormOutputData> = (data) => {
    editProduct(data, {
      onSuccess: () => {
        Alert.alert('Produto editado.')
        console.log('Produto editado com sucesso!', data)
        setProduct(undefined)
        closeModal()
      },
      onError: (error) => {
        console.error('Ocorreu um erro ao editar:', error)
        Alert.alert('Ocorreu um erro ao editar: ' + error)
      },
    })
  }

  return (
    <CustomModal
      isVisible={show}
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
            Editar Produto
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
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </CustomModal>
  )
}
