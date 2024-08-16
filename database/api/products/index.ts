import { useMutation, useQuery } from 'react-query'
import { CreateProductRequest, EditProductRequest } from './types'
import { db } from '@/database'
import * as schema from '../../schema'
import { eq } from 'drizzle-orm'
import { queryClient } from '@/providers/query.provider'
import { useDatabase } from '@/database/database'

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
      mutationFn: async ({
        name,
        image,
        purchasePrice,
        salesPrice,
      }: CreateProductRequest) => {
        await db.transaction(async (tx) => {
          const product = await tx
            .insert(schema.products)
            .values({ name, image })
            .returning({ productId: schema.productsPrice.id })
          await tx.insert(schema.productsPrice).values({
            productId: product[0].productId,
            salesPrice,
            purchasePrice,
          })
        })
      },
      onSuccess: () =>
        queryClient.invalidateQueries(productKeys.fetchProducts()),
    }),
  useEditProduct: () =>
    useMutation({
      mutationFn: async ({
        id,
        name,
        image,
        salesPrice,
        purchasePrice,
      }: EditProductRequest) => {
        await db.transaction(async (tx) => {
          await tx
            .update(schema.products)
            .set({ name, image })
            .where(eq(schema.products.id, id))
          await tx.insert(schema.productsPrice).values({
            productId: id,
            salesPrice,
            purchasePrice,
          })
        })
      },
      onSuccess: () =>
        queryClient.invalidateQueries(productKeys.fetchProducts()),
    }),
  useFetchProducts: () => {
    const theDb = useDatabase()
    return useQuery({
      queryKey: productKeys.fetchProducts(),
      queryFn: async () => {
        const response = await theDb.query.products.findMany({
          with: {
            productPrice: {
              orderBy: (productPrice, { desc }) => [
                desc(productPrice.createdAt),
              ],
            },
          },
        })
        return response
      },
    })
  },
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

export const {
  useCreateProduct,
  useEditProduct,
  useFetchProducts,
  useDeleteProduct,
} = productsApi
