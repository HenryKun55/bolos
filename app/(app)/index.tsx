import { Link } from 'expo-router'
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <StatusBar barStyle="light-content" />
      <View className="flex-1">
        <View className="p-4">
          <Text className="text-xl text-white font-Nunito_500Medium">
            Olá, Janete
          </Text>
        </View>
        <View className="gap-4 p-4">
          <TouchableOpacity className="border border-lime-200 px-4 py-10 rounded-xl">
            <Link href="/clients">
              <Text className="text-2xl text-white font-Nunito_500Medium">
                Clientes
              </Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity className="border border-teal-300 px-4 py-10 rounded-xl">
            <Link href="/products">
              <Text className="text-2xl text-white font-Nunito_500Medium">
                Produtos
              </Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity className="border border-fuchsia-300 px-4 py-10 rounded-xl">
            <Link href="/orders">
              <Text className="text-2xl text-white font-Nunito_500Medium">
                Pedidos
              </Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home
