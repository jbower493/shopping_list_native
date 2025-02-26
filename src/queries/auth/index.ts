import { useMutation, useQuery } from '@tanstack/react-query'
import { Credentials, RegisterCredentials, RequestPasswordResetPayload, ResetPasswordPayload, User, UserDataAdditionalUser } from './types'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { MutationResponse, QueryResponse } from '../utils/types'

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

/***** Login *****/
export function useLoginMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const login = (credentials: Credentials): Promise<MutationResponse<{ token: string }>> => axiosInstance.post('/api/login', credentials)

    return useMutation({
        mutationFn: login
    })
}

/***** Register *****/
export function useRegisterMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const register = (credentials: RegisterCredentials): Promise<MutationResponse<{ token: string }>> =>
        axiosInstance.post('/api/register', credentials)

    return useMutation({
        mutationFn: register
    })
}

// /***** Logout *****/

export function useLogoutMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const logout = (): Promise<MutationResponse> => axiosInstance.get('/api/logout')

    return useMutation({
        mutationFn: logout
    })
}

/***** Request password reset *****/
export function useRequestPasswordResetMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const requestPaswordReset = (payload: RequestPasswordResetPayload): Promise<MutationResponse> =>
        axiosInstance.post('/api/forgot-password', payload)

    return useMutation({
        mutationFn: requestPaswordReset
    })
}

/***** Reset password *****/
export function useResetPasswordMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const resetPassword = (payload: ResetPasswordPayload): Promise<MutationResponse> => axiosInstance.post('/api/reset-password', payload)

    return useMutation({
        mutationFn: resetPassword
    })
}
