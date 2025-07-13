import { InferSelectModel } from 'drizzle-orm'
import { products, productsPrice } from '@/database/schema'

export type Product = InferSelectModel<typeof products>
export type ProductPrice = InferSelectModel<typeof productsPrice>
export type ProductWithPrice = Product & {
  productPrice: ProductPrice[]
}
