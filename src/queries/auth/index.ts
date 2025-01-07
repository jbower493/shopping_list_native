import { useQuery } from '@tanstack/react-query'
import { User, UserDataAdditionalUser } from './types'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { QueryResponse } from '../utils/types'

/***** Get user *****/
export const userQueryKey = ['User']

export function useUserQuery() {
    const { axiosInstance } = useContext(FetchContext)

    const getUser = (): Promise<
        QueryResponse<{
            user: User
            additional_user: UserDataAdditionalUser | null
        }>
    > => axiosInstance.get('/api/user')

    return useQuery({
        queryKey: userQueryKey,
        queryFn: getUser,
        select: (response) => response.data,
        staleTime: Infinity
    })
}

// /***** Login *****/
// const login = (credentials: Credentials): Promise<MutationResponse> => axios.post('/login', credentials)

// export function useLoginMutation() {
//     return useMutation({
//         mutationFn: login
//     })
// }

// /***** Register *****/
// const register = (credentials: RegisterCredentials): Promise<MutationResponse> => axios.post('/register', credentials)

// export function useRegisterMutation() {
//     return useMutation({
//         mutationFn: register
//     })
// }

// /***** Logout *****/
// const logout = (): Promise<MutationResponse> => axios.get('/logout')

// export function useLogoutMutation() {
//     return useMutation({
//         mutationFn: logout
//     })
// }

// /***** Request password reset *****/
// const requestPaswordReset = (payload: RequestPasswordResetPayload): Promise<MutationResponse> => axios.post('/forgot-password', payload)

// export function useRequestPasswordResetMutation() {
//     return useMutation({
//         mutationFn: requestPaswordReset
//     })
// }

// /***** Reset password *****/
// const resetPassword = (payload: ResetPasswordPayload): Promise<MutationResponse> => axios.post('/reset-password', payload)

// export function useResetPasswordMutation() {
//     return useMutation({
//         mutationFn: resetPassword
//     })
// }
