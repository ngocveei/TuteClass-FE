import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { queryDefaultOptions } from '@/config/query.config'

const queryClient = new QueryClient({ defaultOptions: queryDefaultOptions })

export function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
