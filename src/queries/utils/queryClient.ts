import { QueryClient } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { flashMessage } from '../../utils/flashMessage'

const fireErrorNotification = (err: unknown) => {
    let errorMessage = 'Something went wrong.'

    if (isAxiosError(err)) {
        const axiosError = err as AxiosError<{
            message: string
            errors: string[] | Record<string, string[]>
        }>

        const errors = axiosError?.response?.data?.errors

        if (Array.isArray(errors) && typeof errors[0] === 'string') {
            errorMessage = errors[0]
        } else if (typeof errors === 'object') {
            const first = Object.values(errors)[0]
            if (Array.isArray(first) && typeof first[0] === 'string') {
                errorMessage = first[0]
            }
        }
    }

    flashMessage({
        message: errorMessage,
        type: 'error'
    })
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            // Defaults to 0. If 0, duplicate queries will always refetch the data even if it already exists
            staleTime: 1000 * 60 * 5
        },
        mutations: {
            onError: (err) => {
                fireErrorNotification(err)
            }
        }
    }
})
