import { useMutation, useQuery } from 'react-query'
import { CreateProductRequest } from './types'
import { db } from '@/database'
import * as schema from '../../schema'
import { eq } from 'drizzle-orm'
import { queryClient } from '@/providers/query.provider'

const productKeys = {
  all: ['products'] as const,
  createProducts: () => [...productKeys.all, 'createProduct'] as const,
  createProduct: () => [...productKeys.createProducts()] as const,
  fetchProductss: () => [...productKeys.all, 'fetchProducts'] as const,
  fetchProducts: () => [...productKeys.fetchProductss()] as const,
}

const productsApi = {
  useCreateProduct: () =>
    useMutation({
      mutationFn: async (product: CreateProductRequest) => {
        const response = await db.insert(schema.products).values(product)
        return response
      },
      onSuccess: () =>
        queryClient.invalidateQueries(productKeys.fetchProducts()),
    }),
  useFetchProducts: () =>
    useQuery({
      queryKey: productKeys.fetchProducts(),
      queryFn: async () => {
        const response = await db.select().from(schema.products)
        return response
      },
    }),
  useDeleteProduct: () =>
    useMutation({
      mutationFn: async (productId: string) => {
        const response = await db
          .delete(schema.products)
          .where(eq(schema.products.id, productId))
        return response
      },
      onSuccess: () =>
        queryClient.invalidateQueries(productKeys.fetchProducts()),
    }),
}

export const { useCreateProduct, useFetchProducts, useDeleteProduct } =
  productsApi
