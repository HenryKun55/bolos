import { useMutation, useQuery } from 'react-query'
import { db } from '@/database'
import * as schema from '../../schema'
import { eq } from 'drizzle-orm'
import { queryClient } from '@/providers/query.provider'
import { CreateClienttRequest } from './types'

const clientKeys = {
  all: ['clients'] as const,
  createClients: () => [...clientKeys.all, 'createClient'] as const,
  createClient: () => [...clientKeys.createClients()] as const,
  fetchClientss: () => [...clientKeys.all, 'fetchClients'] as const,
  fetchClients: () => [...clientKeys.fetchClientss()] as const,
}

const clientsApi = {
  useCreateClient: () =>
    useMutation({
      mutationFn: async (client: CreateClienttRequest) => {
        const response = await db.insert(schema.clients).values(client)
        return response
      },
      onSuccess: () => queryClient.invalidateQueries(clientKeys.fetchClients()),
    }),
  useFetchClients: () =>
    useQuery({
      queryKey: clientKeys.fetchClients(),
      queryFn: async () => {
        const response = await db.select().from(schema.clients)
        return response
      },
    }),
  useDeleteClient: () =>
    useMutation({
      mutationFn: async (clientId: string) => {
        const response = await db
          .delete(schema.clients)
          .where(eq(schema.clients.id, clientId))
        return response
      },
      onSuccess: () => queryClient.invalidateQueries(clientKeys.fetchClients()),
    }),
}

export const { useCreateClient, useFetchClients, useDeleteClient } = clientsApi
