type ProductOrderDetail = {
  productsPriceId: string
  productId: string
  amount: number
}

type ClientOrderDetail = {
  clientId: string
  products: ProductOrderDetail[]
}

type Exhange = {
  productsPriceId: string
  productId: string
  amount: number
}

export type CreateOrderRequest = {
  clients: ClientOrderDetail[]
  exchanges?: Exhange[]
}
