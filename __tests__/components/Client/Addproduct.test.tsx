import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { AddProduct } from '@/components/Product/AddProduct'
import { useCreateProduct } from '@/database/api/products'

jest.mock('@/database/api/products', () => ({
  useCreateProduct: jest.fn(),
}))

describe('AddProduct Component', () => {
  const mutateAsyncMock = jest.fn()

  beforeEach(() => {
    ;(useCreateProduct as jest.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a fake product', async () => {
    const { findByText } = render(<AddProduct />)

    await waitFor(async () => {
      fireEvent.press(await findByText('Adicionar produto'))
      fireEvent.press(await findByText('Criar Fake'))

      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: expect.any(String),
        image: expect.any(String),
        purchasePrice: expect.any(Number),
        salesPrice: expect.any(Number),
      })
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1)
    })
  })
})
