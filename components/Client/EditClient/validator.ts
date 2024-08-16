import { z } from 'zod'

const schema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(2, { message: 'Mínimo duas letras.' }),
  })
)

export type FormData = z.infer<typeof schema>

export default schema
