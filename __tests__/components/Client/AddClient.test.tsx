import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import { AddClient } from '@/components/Client/AddClient'
import { useCreateClient } from '@/database/api/clients'

jest.mock('@/database/api/clients', () => ({
  useCreateClient: jest.fn(),
}))

describe('AddClient Component', () => {
  const mutateAsync = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    ;(useCreateClient as jest.Mock).mockReturnValue({
      mutateAsync,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a client when valid data is submitted', async () => {
    jest.useFakeTimers()

    const { findByText, findByTestId } = render(<AddClient />)

    act(() => {
      jest.runAllTimers()
    })

    await act(async () => {
      fireEvent.press(await findByText('Adicionar cliente'))
      const input = await findByTestId('input-name')
      fireEvent.changeText(input, 'Jane Doe')
      fireEvent.press(await findByText('Criar'))
    })

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ name: 'Jane Doe' })
    })
  })

  it('should create a fake client', async () => {
    jest.useFakeTimers()
    const { findByText } = render(<AddClient />)

    act(() => {
      jest.runAllTimers()
    })

    await act(async () => {
      fireEvent.press(await findByText('Adicionar cliente'))
      fireEvent.press(await findByText('Criar Fake'))

      expect(mutateAsync).toHaveBeenCalledWith({
        name: expect.any(String),
      })
    })
    await waitFor(async () => {
      expect(mutateAsync).toHaveBeenCalledTimes(1)
    })
  })
})
