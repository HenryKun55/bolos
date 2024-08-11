import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { useCreateClient } from '@/database/api/clients'
import { AddClient } from '@/components/Client/AddClient'

jest.mock('@/database/api/clients', () => ({
  useCreateClient: jest.fn(),
}))

describe('AddClient Component', () => {
  const mutateAsyncMock = jest.fn()

  beforeEach(() => {
    ;(useCreateClient as jest.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a fake client', async () => {
    const { getByText } = render(<AddClient />)

    fireEvent.press(getByText('Adicionar cliente'))

    await waitFor(() => {
      fireEvent.press(getByText('Criar Fake'))
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: expect.any(String),
      })
    })

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1)
  })
})
