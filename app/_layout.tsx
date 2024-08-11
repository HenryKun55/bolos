import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'

import { QueryProvider } from '@/providers/query.provider'
import { SQLiteProvider } from '@/providers/sqlite.provider'
import { expoDb } from '@/database'
import { useColorScheme } from 'react-native'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light'
  const [loaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  })

  useDrizzleStudio(expoDb)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryProvider>
        <SQLiteProvider>
          <Stack>
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SQLiteProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
