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
}

export const CustomModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  backdropStyle = 'light',
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
  }, [isVisible])

  const handleBackdropPress = () => {
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View
          className={`flex-1 justify-center items-center ${getBackdropStyle()}`}
          style={{ opacity: fadeAnim }}
        >
          <Pressable
            className="flex-1 justify-center items-center"
            onPress={handleBackdropPress}
          >
            <Animated.View
              className="bg-white rounded-2xl max-w-md shadow-2xl border border-stone-200"
              style={{
                transform: [{ scale: scaleAnim }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 25,
              }}
            >
              <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export const GlassModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  ...modalProps
}: CustomModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible])

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress()
    } else {
      onClose()
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
      <Animated.View
        className="flex-1 justify-center items-center bg-stone-900/20"
        style={{ opacity: fadeAnim }}
      >
        <Pressable
          className="flex-1 justify-center items-center"
          onPress={handleBackdropPress}
        >
          <Animated.View
            className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl mx-4 w-full max-w-md border border-white/20"
            style={{
              transform: [{ translateY: slideAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 15 },
              shadowOpacity: 0.3,
              shadowRadius: 25,
              elevation: 30,
            }}
          >
            <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  )
}

export const BottomSheetModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  ...modalProps
}: CustomModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(300)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
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
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible])

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress()
    } else {
      onClose()
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
      <Animated.View
        className="flex-1 bg-stone-600/20"
        style={{ opacity: fadeAnim }}
      >
        <Pressable className="flex-1" onPress={handleBackdropPress} />
        <Animated.View
          className="bg-white rounded-t-3xl p-6 min-h-[300px] max-h-[80%]"
          style={{
            transform: [{ translateY: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 20,
          }}
        >
          <View className="w-12 h-1 bg-stone-300 rounded-full self-center mb-4" />

          <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

export const MinimalModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  ...modalProps
}: CustomModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isVisible])

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress()
    } else {
      onClose()
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
      <Animated.View
        className="flex-1 justify-center items-center bg-stone-50/60"
        style={{ opacity: fadeAnim }}
      >
        <Pressable
          className="flex-1 justify-center items-center"
          onPress={handleBackdropPress}
        >
          <Animated.View
            className="bg-white p-6 rounded-2xl mx-4 w-full max-w-md border border-stone-200/50"
            style={{
              transform: [{ scale: scaleAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  )
}
