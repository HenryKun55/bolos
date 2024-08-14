import { Alert, AlertButton } from 'react-native'

interface MockAlertActions {
  pressAlertButton(text: string): Promise<void>
}

type MockedCall = Readonly<[string, string, ReadonlyArray<AlertButton>]>

export default function spyOnAlert(): MockAlertActions {
  jest.spyOn(Alert, 'alert')

  let dismissedCalls: ReadonlyArray<MockedCall> = []
  return {
    async pressAlertButton(text: string): Promise<void> {
      //@ts-ignore
      const unhandledCalls = Alert.alert.mock.calls.slice()
      dismissedCalls.forEach((call) => {
        // Only want to remove the first instance in case there are multiple identical calls
        const index = unhandledCalls.indexOf(call)
        dismissedCalls = dismissedCalls.filter((_, i) => i !== index)
      })
      if (unhandledCalls.length === 0) {
        throw new Error('No pending calls to alert')
      }
      const mostRecentCall = unhandledCalls[unhandledCalls.length - 1]
      // TODO: Handle default button case, when no buttons provided
      const targetButton = mostRecentCall[2].find(
        (button: AlertButton) => button.text === text
      )
      if (!targetButton) {
        throw new Error(`No button with text ${text}`)
      }
      if (targetButton.onPress) {
        await targetButton.onPress()
      }
      dismissedCalls = [...dismissedCalls, mostRecentCall]
    },
  }
}
