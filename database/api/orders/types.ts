type ProductOrderDetail = {
  productId: string
  amount: number
}

type ClientOrderDetail = {
  clientId: string
  products: ProductOrderDetail[]
}

type Exhange = {
  productId: string
  amount: number
}

export type CreateOrderRequest = {
  clients: ClientOrderDetail[]
  exchanges?: Exhange[]
}
