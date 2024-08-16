import { FlatList, TouchableOpacity, View, Text, Alert } from 'react-native'
import { useDeleteProduct, useFetchProducts } from '@/database/api/products'
import Feather from '@expo/vector-icons/Feather'
import { Image } from 'expo-image'
import { EditProduct as EditProductInput } from './EditProduct'
import { useState } from 'react'
import { ProductPrice } from '@/database/schema'

export type EditProductInput = {
  id: string
  name: string
  image: string
  productPrice: ProductPrice[]
}

export const ProductsList = () => {
  const { data } = useFetchProducts()
  const { mutateAsync } = useDeleteProduct()

  const [show, setShow] = useState(false)
  const [product, setProduct] = useState<EditProductInput | undefined>(
    undefined
  )

  const handleEdit = (input: EditProductInput) => {
    setProduct(input)
    setShow(true)
  }

  const handleDelete = (productId: string) => {
    Alert.alert('Deletar', 'Remover produto?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on remove product'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => {
          mutateAsync(productId).then(() => {
            console.log('Product: ' + productId + ' deleted.')
          })
        },
      },
    ])
  }

  return (
    <>
      <FlatList
        className="flex-1 p-5"
        data={data}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View>
            <Text className="text-white text-center">Sem produtos</Text>
          </View>
        }
        ListFooterComponent={<View className="h-10" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <View className="gap-4 flex-row items-center">
              <Image className="w-20 h-20 rounded-full" source={item.image} />
              <Text className="text-white text-2xl mr-auto">{item.name}</Text>
              <View>
                <Text className="text-white">Compra</Text>
                <Text className="text-white">
                  {item.productPrice[0].purchasePrice.toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
              <View>
                <Text className="text-white">Venda</Text>
                <Text
                  className={
                    item.productPrice[0].purchasePrice >
                    item.productPrice[0].salesPrice
                      ? 'text-red-300'
                      : 'text-green-300'
                  }
                >
                  {item.productPrice[0].salesPrice.toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Feather name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <EditProductInput
        show={show}
        setShow={setShow}
        product={product}
        setProduct={setProduct}
      />
    </>
  )
}
