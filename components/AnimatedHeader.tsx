import { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'

type AnimatedHeaderProps = {
  title: string
  subtitle?: string
  showBackButton?: boolean
  rightComponent?: React.ReactNode
  backgroundColor?: string
  textColor?: string
}

export const AnimatedHeader = ({
  title,
  subtitle,
  showBackButton = true,
  rightComponent,
  backgroundColor = 'bg-stone-50',
  textColor = 'text-stone-800',
}: AnimatedHeaderProps) => {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <View className={`${backgroundColor}`}>
        <Animated.View
          className="flex-row items-center justify-between"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="flex-row items-center flex-1">
            {showBackButton && (
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4 p-2 -ml-2"
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={24} color="#44403c" />
              </TouchableOpacity>
            )}

            <View className="flex-1">
              <Text className={`text-2xl font-bold ${textColor}`}>{title}</Text>
              {subtitle && (
                <Text className="text-base text-stone-500 mt-1">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {rightComponent && <View className="ml-4">{rightComponent}</View>}
        </Animated.View>
      </View>
    </>
  )
}
