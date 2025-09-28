import { QueryClient } from '@tanstack/react-query'
import { isAxiosError, type AxiosError } from 'axios'
import { toast } from 'sonner'

type Error = {
  detail: string
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    },
    mutations: {
      onError: (err) => {
        if (isAxiosError(err)) {
          handleAxiosError(err)
        } else {
          toast.error('An unknown error has occurred')
        }

        return err
      }
    }
  }
})

function handleAxiosError(err: AxiosError<Error>) {
  if (!err.response || !err.response.data.detail) {
    toast.error('An unknown error has occurred')
    return
  }

  const { detail } = err.response.data

  if (typeof detail === 'string') {
    toast.error(detail)
    return
  }
}
