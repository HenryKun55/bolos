import { Stack } from 'expo-router'

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1f2937' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Início',
          headerShown: false,
        }}
      />
      <Stack.Screen name="orders/index" options={{ headerTitle: 'Pedidos' }} />
      <Stack.Screen name="orders/[id]" options={{ headerTitle: 'Pedido' }} />
      <Stack.Screen name="products" options={{ headerTitle: 'Produtos' }} />
      <Stack.Screen name="clients" options={{ headerTitle: 'Clientes' }} />
    </Stack>
  )
}
