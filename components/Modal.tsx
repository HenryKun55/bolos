import { Modal, Pressable, Keyboard, ModalProps } from 'react-native'

interface CustomModalProps extends ModalProps {
  isVisible: boolean
  onClose: () => void
  onBackdropPress?: () => void
  children: React.ReactNode
}

export const CustomModal = ({
  isVisible,
  onClose,
  onBackdropPress,
  children,
  ...modalProps
}: CustomModalProps) => {
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
      animationType="slide"
      onRequestClose={onClose}
      {...modalProps}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={handleBackdropPress}
      >
        <Pressable
          className="bg-gray-600 p-4 rounded-lg mx-4 w-full max-w-md"
          onPress={Keyboard.dismiss}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  )
}
