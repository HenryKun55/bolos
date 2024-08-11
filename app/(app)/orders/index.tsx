import { AddOrder } from '@/components/Order/AddOrder'
import { OrderList } from '@/components/Order/OrderList'
import { SafeAreaView } from 'react-native'

const Orders = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <OrderList />
      <AddOrder />
    </SafeAreaView>
  )
}

export default Orders
