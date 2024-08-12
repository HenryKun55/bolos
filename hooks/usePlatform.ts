import { Platform } from 'react-native'

export const usePlatform = () => {
  return Platform.OS === 'ios' ? 'ios' : 'android'
}

export const useAndroidPlatform = () => {
  return Platform.OS === 'android'
}

export const useIosPlatform = () => {
  return Platform.OS === 'ios'
}
