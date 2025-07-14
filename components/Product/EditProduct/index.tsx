import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Keyboard,
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
  setShow: Dispatch<SetStateAction<boolean>>
  product: ProductWithPrice | undefined
  setProduct: Dispatch<SetStateAction<ProductWithPrice | undefined>>
}

export const EditProduct = ({
  show,
  setShow,
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

  const closeModal = () => {
    setShow(false)
    setProduct(undefined)
  }

  const onSubmit: SubmitHandler<FormOutputData> = (data) => {
    editProduct(data, {
      onSuccess: () => {
        console.log('Produto editado com sucesso!')
        closeModal()
      },
      onError: (error) => {
        console.error('Ocorreu um erro ao editar:', error)
        Alert.alert('Ocorreu um erro ao editar: ' + error)
      },
    })
  }

  const handleDismissModal = () => {
    Alert.alert('Cancelar', 'Cancelar edição?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on edit product.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => closeModal(),
      },
    ])
  }

  return (
    <CustomModal
      isVisible={show}
      onClose={handleDismissModal}
      onBackdropPress={handleDismissModal}
      twClassNameView="px-4"
    >
      <View className="p-6 h-[600px] justify-center rounded-lg bg-white">
        <Text className="text-2xl font-bold text-stone-800 mb-6">
          Editar Produto
        </Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        >
          <Pressable onPress={Keyboard.dismiss}>
            <View className="w-full gap-5">
              <View className="w-full items-center">
                {watch('image') ? (
                  <Image
                    source={{ uri: watch('image') }}
                    className="w-40 h-40 rounded-full"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-lg bg-stone-100 items-center justify-center">
                    <Feather
                      name="image"
                      size={40}
                      className="text-stone-400"
                    />
                  </View>
                )}
              </View>

              <View className="w-full">
                <InputForm
                  control={control}
                  name="name"
                  inputProps={{ label: 'Nome do Produto' }}
                />
              </View>
              <View className="w-full">
                <InputForm
                  control={control}
                  name="image"
                  inputProps={{ label: 'URL da Imagem' }}
                />
              </View>
              <View className="w-full">
                <InputForm
                  control={control}
                  name="purchasePrice"
                  inputProps={{
                    label: 'Preço de Custo (R$)',
                    keyboardType: 'numeric',
                  }}
                />
              </View>
              <View className="w-full">
                <InputForm
                  control={control}
                  name="salesPrice"
                  inputProps={{
                    label: 'Preço de Venda (R$)',
                    keyboardType: 'numeric',
                  }}
                />
              </View>

              <View className="flex-row gap-3 mt-8">
                <TouchableOpacity
                  onPress={closeModal}
                  className="flex-1 p-4 bg-stone-200 rounded-lg"
                >
                  <Text className="text-center font-bold text-stone-700">
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  className="flex-1 p-4 bg-emerald-500 rounded-lg flex-row justify-center items-center"
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
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </CustomModal>
  )
}
