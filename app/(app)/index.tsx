import { CardHome } from '@/components/NavCard'
import { SafeAreaView, StatusBar, Text, View } from 'react-native'

const Home = () => {
  const userName = 'Janete'

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <View className="flex-1 p-6">
        {/* Cabeçalho */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-stone-800">
            Olá, {userName}
          </Text>
          <Text className="text-base text-stone-500">
            Pronta para adoçar o dia?
          </Text>
        </View>

        {/* Navegação Principal em Grade */}
        <View className="flex flex-row flex-wrap justify-between">
          <CardHome
            href="/clients"
            iconName="users"
            title="Clientes"
            description="Gerencie seus clientes"
            color="text-sky-800"
            twClassName="bg-sky-100 mb-4"
          />
          <CardHome
            href="/products"
            iconName="package"
            title="Produtos"
            description="Veja seus bolos e doces"
            color="text-emerald-800"
            twClassName="bg-emerald-100 mb-4"
          />
          <CardHome
            href="/orders"
            iconName="clipboard"
            title="Pedidos"
            description="Consulte o histórico"
            color="text-purple-800"
            twClassName="bg-purple-100"
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home
