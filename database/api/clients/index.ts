import { useMutation, useQuery } from 'react-query'
import { db } from '@/database'
import * as schema from '../../schema'
import { eq } from 'drizzle-orm'
import { queryClient } from '@/providers/query.provider'
import { CreateClienttRequest, EditClienttRequest } from './types'

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
      mutationFn: async (input: CreateClienttRequest) => {
        const response = await db.insert(schema.clients).values(input)
        return response
      },
      onSuccess: () => queryClient.invalidateQueries(clientKeys.fetchClients()),
    }),
  useEditClient: () =>
    useMutation({
      mutationFn: async (input: EditClienttRequest) => {
        const response = await db
          .update(schema.clients)
          .set({ name: input.name })
          .where(eq(schema.clients.id, input.id))
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

export const {
  useCreateClient,
  useEditClient,
  useFetchClients,
  useDeleteClient,
} = clientsApi
