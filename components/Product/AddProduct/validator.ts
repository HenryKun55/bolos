import { z } from 'zod'

const schema = z.lazy(() =>
  z.object({
    name: z.string().min(2, { message: 'Mínimo duas letras.' }),
    image: z.string().url({ message: 'Precisa ser uma url válida' }),
    purchasePrice: z
      .string()
      .min(3, { message: 'Mínimo 3 dígitos' })
      .transform((value) => parseFloat(value.replace(',', '.'))),
    salesPrice: z
      .string()
      .min(3, { message: 'Mínimo 3 dígitos' })
      .transform((value) => parseFloat(value.replace(',', '.'))),
  })
)

export type FormData = z.infer<typeof schema>

export default schema
