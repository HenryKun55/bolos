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
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-800">
      <StatusBar barStyle="light-content" />
      <View className="gap-4 items-center justify-center">
        <TouchableOpacity>
          <Link href="/clients">
            <Text className="text-2xl text-white font-Nunito_500Medium">
              Clientes
            </Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/products">
            <Text className="text-2xl text-white font-Nunito_500Medium">
              Produtos
            </Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/orders">
            <Text className="text-2xl text-white font-Nunito_500Medium">
              Pedidos
            </Text>
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Home
