import { AddProduct } from '@/components/Product/AddProduct'
import { ProductsList } from '@/components/Product/ProductsList'
import { SafeAreaView } from 'react-native'

const Products = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <ProductsList />
      <AddProduct />
    </SafeAreaView>
  )
}

export default Products
