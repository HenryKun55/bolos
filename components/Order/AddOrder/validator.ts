import { z } from 'zod'

const schema = z.object({
  clients: z
    .object({
      clientId: z.string(),
      products: z
        .object({
          productId: z.string(),
          productsPriceId: z.string(),
          amount: z.number().min(1, { message: 'Mínimo 1 quantidade' }),
        })
        .array()
        .min(1),
    })
    .array()
    .min(1),
  exchanges: z
    .object({
      productId: z.string(),
      productsPriceId: z.string(),
      amount: z.number().min(1, { message: 'Mínimo 1 quantidade' }),
    })
    .array()
    .optional(),
})

export type FormData = z.infer<typeof schema>

export default schema
