import { FlatList, TouchableOpacity, View, Text, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useDeleteProduct, useFetchProducts } from '@/database/api/products'
import { EditProduct } from './EditProduct'
import { useState } from 'react'
import { Image } from 'expo-image'
import { CustomModal } from '@/components/Modal'
import { ProductWithPrice } from '@/@types/product'

const PriceDisplay = ({
  label,
  value,
  colorClass = 'text-stone-600',
  twClassName,
}: {
  label: string
  value: number
  colorClass?: string
  twClassName?: string
}) => (
  <View className={twClassName}>
    <Text className="text-xs text-stone-500">{label}</Text>
    <Text className={`text-base font-semibold ${colorClass}`}>
      {value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
      })}
    </Text>
  </View>
)

export const ProductsList = () => {
  const { data: products } = useFetchProducts()
  const { mutate: deleteProduct } = useDeleteProduct()

  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<
    ProductWithPrice | undefined
  >(undefined)

  const openEditModal = (product: ProductWithPrice) => {
    setSelectedProduct(product)
    setEditModalVisible(true)
  }

  const closeEditModal = () => {
    setSelectedProduct(undefined)
    setEditModalVisible(false)
  }

  const openDeleteModal = (product: ProductWithPrice) => {
    setSelectedProduct(product)
    setDeleteModalVisible(true)
  }

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id, {
        onSuccess: () => {
          console.log(`Product ${selectedProduct.name} deleted.`)
          setDeleteModalVisible(false)
          setSelectedProduct(undefined)
        },
      })
    }
  }
  const handleDeleteProductConfirmation = () => {
    Alert.alert('Remover', 'Deseja remover o produto?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on remove product.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => handleDelete(),
      },
    ])
  }

  const handleDismissEditModal = () => {
    Alert.alert('Cancelar', 'Cancelar edição de produto?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed on edit product.'),
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => closeEditModal(),
      },
    ])
  }

  return (
    <>
      <FlatList
        data={products}
        className="pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={<Text>Nenhum produto cadastrado</Text>}
        renderItem={({ item }) => {
          const purchasePrice = item.productPrice[0]?.purchasePrice ?? 0
          const salesPrice = item.productPrice[0]?.salesPrice ?? 0
          const hasProfit = salesPrice > purchasePrice

          return (
            <View className="bg-white p-4 rounded-xl border border-stone-200 flex-row items-center">
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-lg mr-4 bg-stone-100"
                placeholder="L184iAoffQof00ayfQay~qj[fQj[" // Placeholder desfocado
                transition={300}
              />
              <View className="flex-1 gap-1">
                <Text
                  className="text-lg font-bold text-stone-800"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View className="flex-row">
                  <PriceDisplay
                    twClassName="mr-1"
                    label="Custo"
                    value={purchasePrice}
                  />
                  <PriceDisplay
                    label="Venda"
                    value={salesPrice}
                    colorClass={hasProfit ? 'text-green-600' : 'text-red-600'}
                  />
                </View>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  className="p-2"
                >
                  <Feather name="edit-2" size={20} className="text-stone-500" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openDeleteModal(item)}
                  className="p-2"
                >
                  <Feather name="trash" size={20} className="text-red-500" />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />

      {selectedProduct && (
        <EditProduct
          show={isEditModalVisible}
          closeModal={closeEditModal}
          handleDismissModal={handleDismissEditModal}
          product={selectedProduct}
          setProduct={setSelectedProduct}
        />
      )}

      {selectedProduct && (
        <CustomModal
          isVisible={isDeleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          twClassNameWrapper="mx-4"
        >
          <View className="p-4">
            <View className="items-center mb-2">
              <Feather
                name="alert-triangle"
                size={40}
                className="text-red-500"
              />
            </View>
            <Text className="text-xl font-bold text-center text-stone-800 mb-2">
              Confirmar Exclusão
            </Text>
            <Text className="text-base text-stone-600 text-center mb-6">
              Deseja realmente remover o produto{' '}
              <Text className="font-bold">{selectedProduct.name}</Text>?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 p-3 bg-stone-200 rounded-lg"
              >
                <Text className="text-center font-bold text-stone-700">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteProductConfirmation}
                className="flex-1 p-3 bg-red-500 rounded-lg"
              >
                <Text className="text-center font-bold text-white">
                  Sim, Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      )}
    </>
  )
}
