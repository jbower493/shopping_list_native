import { useContext } from 'react'
import { QueryKeySet } from '../utils/keyFactory'
import { MutationResponse, QueryResponse } from '../utils/types'
import { AddItemToListPayload, DetailedList, EditListPayload, List, ListItem, NewList, UpdateListItemQuantityPayload } from './types'
import { FetchContext } from '../utils/fetchContext'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { categoriesQueryKey, getCategories } from '../categories'
import { getItems, itemsQueryKey } from '../items'
import { getQuantityUnits, quantityUnitsQueryKey } from '../quantityUnits'
import { QuantityUnit } from '../quantityUnits/types'

const listsKeySet = new QueryKeySet('List')

/***** Get lists *****/
const getLists = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ lists: List[] }>> => axiosInstance.get('/api/list')
export const listsQueryKey = listsKeySet.many

export function useListsQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: listsQueryKey(),
        queryFn: () => getLists(axiosInstance),
        select: (res) => res.data.lists
    })
}

export function prefetchListsQuery(queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({ queryKey: listsQueryKey(), queryFn: () => getLists(axiosInstance) })
}

/***** Create list *****/
export function useCreateListMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const createList = (newList: NewList): Promise<MutationResponse<{ list_id: number }>> => axiosInstance.post('/api/list', newList)

    return useMutation({
        mutationFn: createList,
        onSuccess(res) {
            queryClient.invalidateQueries({ queryKey: listsQueryKey() })
            prefetchSingleListQuery(res.data?.list_id.toString() || '', axiosInstance, queryClient)
        }
    })
}

/***** Delete list *****/
export function useDeleteListMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const deleteList = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/list/${id}`)

    return useMutation({
        mutationFn: deleteList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: listsQueryKey() })
        }
    })
}

/***** Get single list *****/
export const getSingleList = (
    id: string,
    signal: AbortSignal | undefined,
    axiosInstance: AxiosInstance
): Promise<QueryResponse<{ list: DetailedList }>> => axiosInstance.get(`/api/list/${id}`, { signal })
export const singleListQueryKey = listsKeySet.one

export function useGetSingleListQuery(id: string) {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: singleListQueryKey(id),
        queryFn: ({ signal }) => getSingleList(id, signal, axiosInstance),
        select: (res) => res.data.list
    })
}

export function prefetchSingleListQuery(listId: string, axiosInstance: AxiosInstance, queryClient: QueryClient) {
    queryClient.prefetchQuery({ queryKey: singleListQueryKey(listId), queryFn: ({ signal }) => getSingleList(listId, signal, axiosInstance) })
}

/***** Add item to list *****/
export function useAddItemToListMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const addItemToList = ({ listId, itemName, categoryId, quantity, quantityUnitId }: AddItemToListPayload): Promise<MutationResponse> => {
        const body: { item_name: string; category_id?: string; quantity: number; quantity_unit_id?: number } = {
            item_name: itemName,
            quantity
        }

        if (categoryId) {
            body.category_id = categoryId
        }
        if (quantityUnitId) {
            body.quantity_unit_id = quantityUnitId
        }

        return axiosInstance.post(`/api/list/${listId}/add-item`, body)
    }

    return useMutation({
        mutationFn: addItemToList,
        onMutate: async (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleListQueryKey(payload.listId) })

            // Snapshot the data of the current queries
            type SingleListQueryData = Awaited<ReturnType<typeof getSingleList>> | undefined
            const singleListQueryData: SingleListQueryData = queryClient.getQueryData(singleListQueryKey(payload.listId))

            type CategoriesQueryData = Awaited<ReturnType<typeof getCategories>> | undefined
            const categoriesQueryData: CategoriesQueryData = queryClient.getQueryData(categoriesQueryKey())

            type ItemsQueryData = Awaited<ReturnType<typeof getItems>> | undefined
            const itemsQueryData: ItemsQueryData = queryClient.getQueryData(itemsQueryKey())

            type QuantityUnitsData = Awaited<ReturnType<typeof getQuantityUnits>> | undefined
            const quantityUnitsQueryData: QuantityUnitsData = queryClient.getQueryData(quantityUnitsQueryKey())

            // Optimistically update to new value
            queryClient.setQueryData(singleListQueryKey(payload.listId), (old: SingleListQueryData) => {
                if (!old) {
                    return undefined
                }

                const matchingItem = itemsQueryData?.data.items.find(({ name }) => name === payload.itemName)

                const getAddedItemCategory = () => {
                    function getCategoryId() {
                        // If its a new item and therefore it is getting assigned a category on creation
                        if (payload.categoryId) {
                            return Number(payload.categoryId)
                        }

                        // If its an existing item, check the items list to see what it's category is (if it has a category)
                        const matchingItemCategory = matchingItem?.category

                        return matchingItemCategory?.id || null
                    }

                    const categoryId = getCategoryId()

                    if (!categoryId) {
                        return null
                    }
                    return {
                        id: categoryId,
                        name: categoriesQueryData?.data.categories.find(({ id }) => id === categoryId)?.name || ''
                    }
                }

                function getAddedItemQuantity(): ListItem['item_quantity'] {
                    return {
                        quantity: payload.quantity,
                        quantity_unit: payload.quantityUnitId
                            ? quantityUnitsQueryData?.data.quantity_units.find((quantityUnit) => quantityUnit.id === payload.quantityUnitId) || null
                            : null
                    }
                }

                const newItems: ListItem[] = [
                    ...old.data.list.items,
                    {
                        id: 0,
                        name: payload.itemName,
                        category: getAddedItemCategory(),
                        item_quantity: getAddedItemQuantity(),
                        image_url: matchingItem?.image_url || null
                    }
                ]

                const newData: SingleListQueryData = {
                    data: {
                        list: {
                            ...old.data.list,
                            items: newItems.sort((a, b) => (a.name > b.name ? 1 : -1))
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleListQueryData: singleListQueryData
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate affected queries on success
            queryClient.invalidateQueries({
                queryKey: singleListQueryKey(variables.listId)
            })
            queryClient.invalidateQueries({ queryKey: itemsQueryKey() })
        },
        onError: (err, variables, context) => {
            // Roll back to old data on error
            queryClient.setQueryData(singleListQueryKey(variables.listId), context?.singleListQueryData)
        }
    })
}

/***** Remove item from list *****/
export function useRemoveItemFromListMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const removeItemFromList = async ({ listId, itemId }: { listId: string; itemId: number }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/list/${listId}/remove-item`, { item_id: itemId })

    return useMutation({
        mutationFn: removeItemFromList,
        onMutate: (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleListQueryKey(payload.listId) })

            // Snapshot the data of the current queries
            type SingleListQueryData = Awaited<ReturnType<typeof getSingleList>> | undefined
            const singleListQueryData: SingleListQueryData = queryClient.getQueryData(singleListQueryKey(payload.listId))

            // Optimistically update to new value
            queryClient.setQueryData(singleListQueryKey(payload.listId), (old: SingleListQueryData) => {
                if (!old) {
                    return undefined
                }

                const newData: SingleListQueryData = {
                    data: {
                        list: {
                            ...old.data.list,
                            items: old.data.list.items.filter((item) => item.id !== payload.itemId)
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleListQueryData: singleListQueryData
            }
        },
        onSuccess: (data, variables) => {
            // "isMutating" seems to return 1 for the current mutation even in the on success handler. If "isMutating" is greater than 1, that means that previous deletions are still happening. So we only want to invalidate the cache if its the last deletion
            if (queryClient.isMutating() < 2) {
                queryClient.invalidateQueries({
                    queryKey: singleListQueryKey(variables.listId)
                })
            }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(singleListQueryKey(variables.listId), context?.singleListQueryData)
        }
    })
}

/***** Add items from recipe *****/
export function useAddItemsFromRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const addItemsFromRecipe = ({ listId, recipeId }: { listId: string; recipeId: string }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/list/${listId}/add-from-recipe/${recipeId}`)

    return useMutation({
        mutationFn: addItemsFromRecipe
    })
}

/***** Add items from menu *****/
export function useAddItemsFromMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const addItemsFromMenu = ({ listId, menuId }: { listId: string; menuId: string }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/list/${listId}/add-from-menu/${menuId}`)

    return useMutation({
        mutationFn: addItemsFromMenu
    })
}

/***** Edit list *****/
export function useEditListMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const editList = ({ listId, attributes }: { listId: string; attributes: EditListPayload }): Promise<MutationResponse> =>
        axiosInstance.put(`/api/list/${listId}`, attributes)

    return useMutation({
        mutationFn: editList
    })
}

/***** Update item quantity *****/
export function useUpdateListItemQuantityMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const updateListItemQuantity = ({
        listId,
        attributes
    }: {
        listId: string
        attributes: UpdateListItemQuantityPayload
    }): Promise<MutationResponse> => axiosInstance.put(`/api/list/${listId}/update-item-quantity`, attributes)

    return useMutation({
        mutationFn: updateListItemQuantity,
        onSuccess(data, variables) {
            queryClient.setQueryData(singleListQueryKey(variables.listId || ''), (old: Awaited<ReturnType<typeof getSingleList>> | undefined) => {
                if (!old) {
                    return undefined
                }

                function getNewQuantityUnit() {
                    const sentQuanityUnitId = variables.attributes.quantity_unit_id

                    if (!variables.attributes.quantity_unit_id) {
                        return null
                    }

                    type QuantityUnitsData = Awaited<ReturnType<typeof getQuantityUnits>> | undefined
                    const quantityUnitsQueryData: QuantityUnitsData = queryClient.getQueryData(quantityUnitsQueryKey())

                    const foundUnit = quantityUnitsQueryData?.data.quantity_units.find((unit) => unit.id === sentQuanityUnitId)

                    if (!foundUnit?.name || !foundUnit?.symbol) {
                        return null
                    }

                    const newUnit = {
                        id: sentQuanityUnitId,
                        name: foundUnit?.name,
                        symbol: foundUnit?.symbol
                    } as QuantityUnit

                    return newUnit
                }

                const newData = {
                    ...old,
                    data: {
                        list: {
                            ...old.data.list,
                            items: old.data.list.items.map((item) => {
                                if (item.id !== Number(variables.attributes.item_id)) {
                                    return item
                                }

                                return {
                                    ...item,
                                    item_quantity: {
                                        quantity: Number(variables.attributes.quantity),
                                        quantity_unit: getNewQuantityUnit()
                                    }
                                }
                            })
                        }
                    }
                }

                return newData
            })

            queryClient.invalidateQueries({ queryKey: singleListQueryKey(variables.listId || '') })
        }
    })
}
