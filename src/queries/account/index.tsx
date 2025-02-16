import { useContext } from 'react'
import { QueryKeySet } from '../utils/keyFactory'
import { MutationResponse, QueryResponse } from '../utils/types'
import { AccountAccess, AdditionalUser } from './types'
import { FetchContext } from '../utils/fetchContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userQueryKey } from '../auth'

const additionalUserKeySet = new QueryKeySet('Additional_User')

/***** Get additional users *****/
export const additionalUsersQueryKey = additionalUserKeySet.many

export function useAdditionalUsersQuery() {
    const { axiosInstance } = useContext(FetchContext)

    const getAdditionalUsers = (): Promise<QueryResponse<{ additional_users: AdditionalUser[] }>> => axiosInstance.get('/api/user/additional-user')

    return useQuery({
        queryKey: additionalUsersQueryKey(),
        queryFn: getAdditionalUsers,
        select: (res) => res.data.additional_users
    })
}

/***** Get account access list *****/
const accoutAccessKeySet = new QueryKeySet('Account_Access')
export const accountAccessQueryKey = accoutAccessKeySet.many

export function useAccountAccessQuery() {
    const { axiosInstance } = useContext(FetchContext)

    const getAccountAccess = (): Promise<QueryResponse<{ account_access: AccountAccess[] }>> =>
        axiosInstance.get('/api/user/additional-user/account-access')

    return useQuery({
        queryKey: accountAccessQueryKey(),
        queryFn: getAccountAccess,
        select: (res) => res.data.account_access
    })
}

/***** Add additional user *****/
export function useAddAdditionalUserMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const addAdditionalUser = ({ additional_user_email }: { additional_user_email: string }): Promise<MutationResponse> =>
        axiosInstance.post('/api/user/additional-user', { additional_user_email })

    return useMutation({
        mutationFn: addAdditionalUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: additionalUsersQueryKey() })
        }
    })
}

/***** Remove additional user *****/
export function useRemoveAdditionalUserMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const removeAdditionalUser = ({ additional_user_email }: { additional_user_email: string }): Promise<MutationResponse> =>
        axiosInstance.post('/api/user/additional-user/remove', { additional_user_email })

    return useMutation({
        mutationFn: removeAdditionalUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: additionalUsersQueryKey() })
        }
    })
}

/***** Login as another user *****/
export function useLoginAsAnotherUserMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const loginAsAnotherUser = ({ user_email_to_login_as }: { user_email_to_login_as: string }): Promise<MutationResponse> =>
        axiosInstance.post('/api/user/additional-user/login-as-another-user', { user_email_to_login_as })

    return useMutation({
        mutationFn: loginAsAnotherUser,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: userQueryKey })
        }
    })
}

/***** Change email *****/
export function useChangeEmailMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const changeEmail = ({ new_email }: { new_email: string }): Promise<MutationResponse> =>
        axiosInstance.post('/api/user/change-email', { new_email })

    return useMutation({
        mutationFn: changeEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKey })
        }
    })
}

/***** Change password *****/
export function useChangePasswordMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const changePassword = (attributes: { new_password: string; confirm_new_password: string }): Promise<MutationResponse> =>
        axiosInstance.post('/api/user/change-password', attributes)

    return useMutation({
        mutationFn: changePassword
    })
}

/***** Delete account *****/
export function useDeleteAccountMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const deleteAccount = ({ userId }: { userId: string }): Promise<MutationResponse> => axiosInstance.delete(`/api/user/${userId}`)

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKey })
        }
    })
}
