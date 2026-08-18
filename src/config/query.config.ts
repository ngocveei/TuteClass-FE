import type { DefaultOptions } from '@tanstack/react-query'

export const queryDefaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
}
