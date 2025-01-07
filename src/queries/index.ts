import { userQueryKey, useUserQuery } from './auth'

export const query = {
    auth: {
        user: {
            useQuery: useUserQuery,
            queryKey: userQueryKey
        }
    }
}
