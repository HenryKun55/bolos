import { AnimatedHeader } from '@/components/AnimatedHeader'
import { AddProduct } from '@/components/Product/AddProduct'
import { ProductsList } from '@/components/Product/ProductsList'
import { SafeAreaView, View } from 'react-native'

const Products = () => {
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="flex-1 p-6">
        <AnimatedHeader title="Produtos" />
        <ProductsList />
        <AddProduct />
      </View>
    </SafeAreaView>
  )
}

export default Products
