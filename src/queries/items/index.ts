import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { QueryKeySet } from '../utils/keyFactory'
import { MutationResponse, QueryResponse } from '../utils/types'
import { EditItemPayload, Item, NewItem } from './types'
import { AxiosInstance } from 'axios'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { listsQueryKey } from '../lists'
import { recipesQueryKey } from '../recipes'

const itemsKeySet = new QueryKeySet('Item')

/***** Get items *****/
export const getItems = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ items: Item[] }>> => axiosInstance.get('/api/item')
export const itemsQueryKey = itemsKeySet.many

export function useGetItemsQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: itemsQueryKey(),
        queryFn: () => getItems(axiosInstance),
        select: (res) => res.data.items
    })
}

export function prefetchGetItemsQuery(queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({ queryKey: itemsQueryKey(), queryFn: () => getItems(axiosInstance) })
}

/***** Create item *****/
export function useCreateItemMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const createItem = (newItem: NewItem): Promise<MutationResponse> => axiosInstance.post('/api/item', newItem)

    return useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemsQueryKey() })
        }
    })
}

/***** Delete item *****/
export function useDeleteItemMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const deleteItem = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/item/${id}`)

    return useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemsQueryKey() })
        }
    })
}

/***** Edit item *****/
export function useEditItemMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const editItem = ({ itemId, attributes }: { itemId: string; attributes: EditItemPayload }): Promise<MutationResponse> =>
        axiosInstance.put(`/api/item/${itemId}`, attributes)

    return useMutation({
        mutationFn: editItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
            queryClient.invalidateQueries({ queryKey: listsQueryKey() })
            queryClient.invalidateQueries({ queryKey: itemsQueryKey() })
        }
    })
}

/***** Upload item image *****/
export function useUploadItemImageMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const uploadItemImage = ({ id, formData }: { id: string; formData: FormData }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/item/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    return useMutation({
        mutationFn: uploadItemImage
    })
}

/***** Remove item image *****/
export function useRemoveItemImageMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const removeItemImage = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/item/${id}/remove-image`)

    return useMutation({
        mutationFn: removeItemImage
    })
}
