import Feather from '@expo/vector-icons/Feather'
import { Href, Link } from 'expo-router'
import { Text, View, TouchableOpacity } from 'react-native'

type CardHomeProps = {
  href: Href
  iconName: keyof typeof Feather.glyphMap
  title: string
  description: string
  color: string
  twClassName?: string
}

export const CardHome = ({
  href,
  iconName,
  title,
  description,
  color,
  twClassName,
}: CardHomeProps) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        className={`w-[47%] h-48 justify-between p-4 rounded-2xl ${twClassName}`}
      >
        <Feather name={iconName} size={32} color="#000" />
        <View>
          <Text className={`text-xl font-bold ${color}`}>{title}</Text>
          <Text className={`text-sm opacity-80 ${color}`}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}
