import { useEffect, useRef } from 'react'
import {
  Modal,
  Pressable,
  Keyboard,
  ModalProps,
  Animated,
  View,
  TouchableWithoutFeedback,
} from 'react-native'

interface CustomModalProps extends ModalProps {
  isVisible: boolean
  onClose: () => void
  onBackdropPress?: () => void
  children: React.ReactNode
  backdropStyle?: 'blur' | 'light' | 'dark' | 'transparent'
  twClassNameWrapper?: string
  twClassNameContent?: string
}

export const CustomModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  backdropStyle = 'light',
  twClassNameWrapper,
  twClassNameContent,
  ...modalProps
}: CustomModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible, fadeAnim, scaleAnim])

  const handleBackdropPress = () => {
    Keyboard.dismiss()
    if (onBackdropPress) {
      onBackdropPress()
    } else {
      onClose()
    }
  }

  const getBackdropStyle = () => {
    switch (backdropStyle) {
      case 'blur':
        return 'bg-white/20 backdrop-blur-sm'
      case 'light':
        return 'bg-stone-200/40'
      case 'dark':
        return 'bg-stone-800/30'
      case 'transparent':
        return 'bg-transparent'
      default:
        return 'bg-stone-200/40'
    }
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      {...modalProps}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View
          className={`flex-1 justify-center items-center ${getBackdropStyle()} ${twClassNameWrapper}`}
          style={{ opacity: fadeAnim }}
        >
          <Pressable
            className="absolute top-0 left-0 right-0 bottom-0"
            onPress={handleBackdropPress}
          />

          <Animated.View
            onStartShouldSetResponder={() => true}
            className={`bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 ${twClassNameContent}`}
            style={{
              transform: [{ scale: scaleAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 25,
            }}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
