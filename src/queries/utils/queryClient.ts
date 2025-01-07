import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
// import { toast } from 'react-hot-toast'

export const fireErrorNotification = (err: unknown) => {
    let errorMessage = 'Something went wrong.'

    if (isAxiosError(err)) {
        const errors = err?.response?.data?.errors

        if (Array.isArray(errors) && typeof errors[0] === 'string') {
            errorMessage = errors[0]
        }

        if (typeof errors === 'object') {
            const first = Object.values(errors)[0]
            if (Array.isArray(first) && typeof first[0] === 'string') {
                errorMessage = first[0]
            }
        }
    }

    console.error(errorMessage)
    // toast.error(errorMessage)
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
