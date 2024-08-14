import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import { AddProduct } from '@/components/Product/AddProduct'
import { useCreateProduct } from '@/database/api/products'

jest.mock('@/database/api/products', () => ({
  useCreateProduct: jest.fn(),
}))

jest.mock('expo-image', () => {
  const actualExpoImage = jest.requireActual('expo-image')
  const { Image } = jest.requireActual('react-native')

  return { ...actualExpoImage, Image }
})

describe('AddProduct Component', () => {
  const mutateAsync = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    ;(useCreateProduct as jest.Mock).mockReturnValue({
      mutateAsync,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a product when valid data is submitted', async () => {
    const { findByText, findByTestId } = render(<AddProduct />)

    await waitFor(async () => {
      fireEvent.press(await findByText('Adicionar produto'))

      const inputUrlImage = await findByTestId('input-url-image')
      fireEvent.changeText(inputUrlImage, 'https://picsum.photos/50')
      const inputName = await findByTestId('input-name')
      fireEvent.changeText(inputName, 'Produto')
      const inputPurchasePrice = await findByTestId('input-purchase-price')
      fireEvent.changeText(inputPurchasePrice, '5.00')
      const inputSalesPrice = await findByTestId('input-sales-price')
      fireEvent.changeText(inputSalesPrice, '7.00')

      fireEvent.press(await findByText('Criar'))

      expect(mutateAsync).toHaveBeenCalledWith({
        name: 'Produto',
        image: 'https://picsum.photos/50',
        purchasePrice: 5.0,
        salesPrice: 7.0,
      })
    })
  })

  it('should create a fake product', async () => {
    const { findByText } = render(<AddProduct />)

    await waitFor(async () => {
      fireEvent.press(await findByText('Adicionar produto'))
      fireEvent.press(await findByText('Criar Fake'))

      expect(mutateAsync).toHaveBeenCalledWith({
        name: expect.any(String),
        image: expect.any(String),
        purchasePrice: expect.any(Number),
        salesPrice: expect.any(Number),
      })
      expect(mutateAsync).toHaveBeenCalledTimes(1)
    })
  })
})
