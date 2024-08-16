export type CreateProductRequest = {
  name: string
  image: string
  purchasePrice: number
  salesPrice: number
}

export type EditProductRequest = {
  id: string
  name: string
  image: string
  purchasePrice: number
  salesPrice: number
}
