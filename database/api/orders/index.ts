import { useMutation, useQuery } from 'react-query'
import { db } from '@/database'
import * as schema from '../../schema'
import { CreateOrderRequest } from './types'
import { queryClient } from '@/providers/query.provider'
import { useDatabase } from '@/database/database'

const ordersKeys = {
  all: ['orders'] as const,
  fetchOrderss: () => [...ordersKeys.all, 'fetchOrders'] as const,
  fetchOrders: () => [...ordersKeys.fetchOrderss()] as const,
  fetchOrderByIdd: () => [...ordersKeys.all, 'fetchOrderById'] as const,
  fetchOrderById: (id: string) => [...ordersKeys.fetchOrderss(), id] as const,
}

const ordersApi = {
  useFetchOrders: () =>
    useQuery({
      queryKey: ordersKeys.fetchOrders(),
      queryFn: async () => {
        const response = await db.select().from(schema.orders)
        return response
      },
    }),
  useCreateOrder: () => {
    const theDb = useDatabase()
    return useMutation({
      mutationFn: async (input: CreateOrderRequest) => {
        const productOrderDetails = input.clients
          .map((client) => client.products.map((product) => product))
          .flat()

        const productsWithAmount = await Promise.all(
          productOrderDetails.map(async (product) => {
            const findProduct = await theDb.query.products.findFirst({
              where: (products, { eq }) => eq(products.id, product.productId),
            })
            return {
              ...product,
              ...findProduct,
            }
          })
        )

        const totalPurchase = productsWithAmount.reduce(
          (acc, obj) => acc + obj.purchasePrice! * obj.amount!,
          0
        )

        const totalSale = productsWithAmount.reduce(
          (acc, obj) => acc + obj.salesPrice! * obj.amount!,
          0
        )

        const order = await theDb
          .insert(schema.orders)
          .values({ totalSale, totalPurchase })
          .returning({ id: schema.orders.id })
        for (const client of input.clients) {
          const orderDetail = await theDb
            .insert(schema.orderDetails)
            .values({ orderId: order[0].id, clientId: client.clientId })
            .returning({ id: schema.orderDetails.id })
          const productOrderDetails = await theDb
            .insert(schema.productOrderDetail)
            .values(
              client.products.map((product) => ({
                orderDetailId: orderDetail[0].id,
                productId: product.productId,
                amount: product.amount,
              }))
            )
            .returning({ id: schema.productOrderDetail.id })
          for (const productOrderDetail of productOrderDetails) {
            await theDb.insert(schema.productOrderDetailToOrderDetails).values({
              orderDetailId: orderDetail[0].id,
              productOrderDetailId: productOrderDetail.id,
            })
          }
        }
        if (input.exchanges?.length)
          await theDb.insert(schema.exchanges).values(
            input.exchanges.map((exchange) => ({
              productId: exchange.productId,
              amount: exchange.amount,
              orderId: order[0].id,
            }))
          )
      },
      onSuccess: () => queryClient.invalidateQueries(ordersKeys.fetchOrders()),
    })
  },
  useFetchOrderById: (id: string) => {
    const theDb = useDatabase()
    return useQuery({
      queryKey: ordersKeys.fetchOrderById(id),
      queryFn: async () => {
        const response = await theDb.query.orders.findFirst({
          where: (orders, { eq }) => eq(orders.id, id),
          with: {
            exchanges: {
              with: {
                product: true,
              },
            },
            orderDetails: {
              with: {
                client: true,
                productOrderDetailToOrderDetails: {
                  with: {
                    productOrderDetail: {
                      with: {
                        product: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        return response
      },
    })
  },
}

export const { useFetchOrders, useCreateOrder, useFetchOrderById } = ordersApi
