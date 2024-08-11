import { FlatList, View, Text, TouchableOpacity } from 'react-native'
import { useFetchOrders } from '@/database/api/orders'
import dayjs from 'dayjs'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'

export const OrderList = () => {
  const { data } = useFetchOrders()
  const { push } = useRouter()

  return (
    <FlatList
      className="p-5"
      data={data}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListEmptyComponent={
        <View>
          <Text className="text-white text-center">Sem pedidos</Text>
        </View>
      }
      ListFooterComponent={<View className="h-10" />}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="py-4 flex-row items-center"
          onPress={() => push(`/orders/${item.id}`)}
        >
          <Text className="flex-1 text-white text-lg">
            {dayjs(item.createdAt).format('DD/MM/YYYY')}
          </Text>
          <Feather name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      )}
    />
  )
}
