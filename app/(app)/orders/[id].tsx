import { useFetchOrderById } from '@/database/api/orders'
import dayjs from 'dayjs'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'

const OrderDetail = () => {
  const { id } = useLocalSearchParams()
  const { data } = useFetchOrderById(id as string)

  if (!data) return null

  return (
    <ScrollView className="flex-1 p-4 bg-gray-800">
      <Text className="text-white text-lg text-center">
        Pedido do dia:{' '}
        <Text className="text-green-200">
          {dayjs(data?.createdAt).format('DD/MM/YYYY')}
        </Text>
      </Text>
      <View className="gap-2 mt-5">
        {data.orderDetails.map((orderDetail) => (
          <View
            key={orderDetail.id}
            className="p-4 rounded-lg border border-white"
          >
            <Text className="text-white text-xl">
              Cliente: {orderDetail.client.name}
            </Text>
            <Text className="text-white text-lg">Pedido:</Text>
            <View className="mt-3 gap-2">
              {orderDetail.productOrderDetailToOrderDetails.map(
                (productOrderDetailToOrderDetail) => {
                  return (
                    <View
                      key={
                        productOrderDetailToOrderDetail.orderDetailId +
                        productOrderDetailToOrderDetail.productOrderDetailId
                      }
                      className="flex-row justify-between"
                    >
                      <Text className="text-white">
                        {
                          productOrderDetailToOrderDetail.productOrderDetail
                            .product.name
                        }
                      </Text>
                      <Text className="text-white">
                        {
                          productOrderDetailToOrderDetail.productOrderDetail
                            .amount
                        }
                      </Text>
                    </View>
                  )
                }
              )}
            </View>
            <View className="flex-row justify-end items-center">
              <Text className="text-white">Total: </Text>
              <Text className="text-white text-lg">
                {orderDetail.productOrderDetailToOrderDetails
                  .reduce(
                    (acc, curr) =>
                      acc +
                      curr.productOrderDetail.product.salesPrice *
                        curr.productOrderDetail.amount,
                    0
                  )
                  .toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
              </Text>
            </View>
          </View>
        ))}
      </View>
      {data.exchanges.length ? (
        <View className="mt-2">
          <Text className="text-white text-lg mb-2">Trocas</Text>
          {data.exchanges.map((exchange) => (
            <View
              key={exchange.id}
              className="p-4 rounded-lg border border-white"
            >
              <View className="flex-row justify-between">
                <Text className="text-white">{exchange.product.name}</Text>
                <Text className="text-white">{exchange.amount}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
      <View className="mt-5">
        <View className="gap-2 items-end">
          <Text className="text-white">
            Comprado:{' '}
            {data.totalPurchase.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
          <Text className="text-white">
            Vendido:{' '}
            {data.totalSale.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
          <Text className="text-green-300 text-xl">
            Lucro:{' '}
            {(data.totalSale - data.totalPurchase).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderDetail
