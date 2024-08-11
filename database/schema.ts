import { relations, sql } from 'drizzle-orm'
import {
  sqliteTable,
  text,
  real,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import uuid from 'react-native-uuid'

export type Product = {
  id: string
  name: string
  image: string
  purchasePrice: number
  salesPrice: number
}

export const products = sqliteTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  name: text('name').notNull().unique(),
  image: text('image').notNull(),
  purchasePrice: real('purchase_price').notNull(),
  salesPrice: real('sales_price').notNull(),
})

export const productsRelations = relations(products, ({ many }) => ({
  productOrderDetail: many(productOrderDetail),
  exchanges: many(exchanges),
}))

export type ProductOrderDetail = {
  id: string
  amount: number
  orderDetailId: string
}

export const productOrderDetail = sqliteTable('product_order_detail', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  productId: text('product_id')
    .references(() => products.id)
    .notNull(),
  orderDetailId: text('order_detail_id').notNull(),
  amount: integer('amount').notNull(),
})

export const productOrderDetailRelations = relations(
  productOrderDetail,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productOrderDetail.productId],
      references: [products.id],
    }),
    productOrderDetailToOrderDetails: many(productOrderDetailToOrderDetails),
  })
)

export type Client = {
  id: string
  name: string
}

export const clients = sqliteTable('clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  name: text('name').notNull(),
})

export type Order = {
  id: string
  totalPurchase: number
  totalSale: number
  createAt: string
}

export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  totalPurchase: real('total_purchase').notNull(),
  totalSale: real('total_sale').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const ordersRelations = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
  exchanges: many(exchanges),
}))

export type OrderDetail = {
  id: string
  orderId: string
  createdAt: string
}

export const orderDetails = sqliteTable('order_details', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  clientId: text('client_id')
    .references(() => clients.id)
    .notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const orderDetailsRelations = relations(
  orderDetails,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [orderDetails.orderId],
      references: [orders.id],
    }),
    client: one(clients, {
      fields: [orderDetails.clientId],
      references: [clients.id],
    }),
    productOrderDetailToOrderDetails: many(productOrderDetailToOrderDetails),
  })
)

export const productOrderDetailToOrderDetails = sqliteTable(
  'product_order_detail_to_order_details',
  {
    productOrderDetailId: text('product_order_detail_id')
      .notNull()
      .references(() => productOrderDetail.id),
    orderDetailId: text('order_detail_id')
      .notNull()
      .references(() => orderDetails.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productOrderDetailId, t.orderDetailId] }),
  })
)

export const productOrderDetailToOrderDetailsRelations = relations(
  productOrderDetailToOrderDetails,
  ({ one }) => ({
    productOrderDetail: one(productOrderDetail, {
      fields: [productOrderDetailToOrderDetails.productOrderDetailId],
      references: [productOrderDetail.id],
    }),
    orderDetail: one(orderDetails, {
      fields: [productOrderDetailToOrderDetails.orderDetailId],
      references: [orderDetails.id],
    }),
  })
)

export type Exchange = {
  id: string
  orderId: string
  productId: string
  amount: number
}

export const exchanges = sqliteTable('exchange', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid.v4().toString()),
  orderId: text('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: text('product_id')
    .references(() => products.id)
    .notNull(),
  amount: integer('amount').notNull(),
})

export const exchangesRelations = relations(exchanges, ({ one }) => ({
  order: one(orders, {
    fields: [exchanges.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [exchanges.productId],
    references: [products.id],
  }),
}))
