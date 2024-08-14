import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { AddClient } from '@/components/Client/AddClient'
import { useCreateClient } from '@/database/api/clients'

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
    const { findByText } = render(<AddClient />)

    fireEvent.press(await findByText('Adicionar cliente'))
    fireEvent.press(await findByText('Criar Fake'))

    await waitFor(async () => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: expect.any(String),
      })
    })

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1)
  })
})
