import { useLoginMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'

export const query = {
    auth: {
        user: {
            useQuery: useUserQuery,
            queryKey: userQueryKey
        },
        login: {
            useMutation: useLoginMutation
        },
        register: {
            useMutation: useRegisterMutation
        }
    }
}
