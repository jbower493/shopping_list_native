import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    AddItemToRecipePayload,
    ConfirmImportedRecipePayload,
    DetailedRecipe,
    EditRecipePayload,
    NewRecipe,
    Recipe,
    RecipeItem,
    UpdateRecipeItemQuantityPayload
} from './types'
import type { MutationResponse, QueryResponse } from '../utils/types'
import { QueryKeySet } from '../utils/keyFactory'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { AxiosInstance, AxiosResponse } from 'axios'
import { getQuantityUnits, quantityUnitsQueryKey } from '../quantityUnits'
import { categoriesQueryKey, getCategories } from '../categories'
import { getItems, itemsQueryKey } from '../items'
import { QuantityUnit } from '../quantityUnits/types'
import { recipeCategoriesQueryKey } from '../recipeCategories'
import { menusQueryKey } from '../menus'

const recipesKeySet = new QueryKeySet('Recipe')

/***** Get recipes *****/
export type GetRecipesReturnType = ReturnType<typeof getRecipes>
export const recipesQueryKey = recipesKeySet.many

const getRecipes = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ recipes: Recipe[] }>> => axiosInstance.get('/api/recipe')

export function useRecipesQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: recipesQueryKey(),
        queryFn: () => getRecipes(axiosInstance),
        select: (res) => res.data.recipes
    })
}

export function prefetchRecipesQuery(queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({ queryKey: recipesQueryKey(), queryFn: () => getRecipes(axiosInstance) })
}

/***** Create recipe *****/
export function useCreateRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const createRecipe = async (newRecipe: NewRecipe & { newRecipeCategory: string }): Promise<MutationResponse<{ recipe_id: number }>> => {
        const body: NewRecipe = {
            name: newRecipe.name,
            prep_time: newRecipe.prep_time,
            serves: newRecipe.serves,
            instructions: newRecipe.instructions,
            recipe_category_id: newRecipe.recipe_category_id
        }

        if (newRecipe.newRecipeCategory) {
            // If this errors we can just let it throw and the query will stop executing and return an error
            const response = await axiosInstance.post<{ name: string }, AxiosResponse<{ recipe_category: { id: number } }>>('/api/recipe-category', {
                name: newRecipe.newRecipeCategory
            })

            const newRecipeCategoryId = response.data.recipe_category.id

            body.recipe_category_id = newRecipeCategoryId
        }

        return axiosInstance.post('/api/recipe', body)
    }

    return useMutation({
        mutationFn: createRecipe,
        onMutate: (payload) => {
            return {
                isNewRecipeCategoryCreated: !!payload.newRecipeCategory
            }
        },
        onSuccess(res, _, context) {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
            if (context.isNewRecipeCategoryCreated) {
                queryClient.invalidateQueries({ queryKey: recipeCategoriesQueryKey() })
            }
            prefetchSingleRecipeQuery(res.data?.recipe_id.toString() || '', queryClient, axiosInstance)
        }
    })
}

/***** Delete recipe *****/
export function useDeleteRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const deleteRecipe = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/recipe/${id}`)

    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
        }
    })
}

/***** Get single recipe *****/
export const singleRecipeQueryKey = recipesKeySet.one

const getSingleRecipe = (id: string, axiosInstance: AxiosInstance): Promise<QueryResponse<{ recipe: DetailedRecipe }>> =>
    axiosInstance.get(`/api/recipe/${id}`)

export function useSingleRecipeQuery(id: string) {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: singleRecipeQueryKey(id),
        queryFn: () => getSingleRecipe(id, axiosInstance),
        select: (res) => res.data.recipe
    })
}

export function prefetchSingleRecipeQuery(recipeId: string, queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({
        queryKey: singleRecipeQueryKey(recipeId),
        queryFn: () => getSingleRecipe(recipeId, axiosInstance)
    })
}

/***** Add item to recipe *****/
export function useAddItemToRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const addItemToRecipe = async ({
        recipeId,
        itemName,
        newCategory,
        existingCategoryId,
        quantity,
        quantityUnitId
    }: AddItemToRecipePayload): Promise<MutationResponse> => {
        const body: { item_name: string; category_id?: string; quantity: number; quantity_unit_id?: number } = { item_name: itemName, quantity }

        if (newCategory) {
            // If this errors we can just let it throw and the query will stop executing and return an error
            const response = await axiosInstance.post<{ name: string }, AxiosResponse<{ category: { id: number } }>>('/api/category', {
                name: newCategory
            })

            const newCategoryId = response.data.category.id

            body.category_id = newCategoryId.toString()
        }

        if (existingCategoryId) {
            body.category_id = existingCategoryId
        }
        if (quantityUnitId) {
            body.quantity_unit_id = quantityUnitId
        }

        return axiosInstance.post(`/api/recipe/${recipeId}/add-item`, body)
    }

    return useMutation({
        mutationFn: addItemToRecipe,
        onMutate: async (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleRecipeQueryKey(payload.recipeId) })

            // Snapshot the data of the current queries
            type SingleRecipeQueryData = Awaited<ReturnType<typeof getSingleRecipe>> | undefined
            const singleRecipeQueryData: SingleRecipeQueryData = queryClient.getQueryData(singleRecipeQueryKey(payload.recipeId))

            type CategoriesQueryData = Awaited<ReturnType<typeof getCategories>> | undefined
            const categoriesQueryData: CategoriesQueryData = queryClient.getQueryData(categoriesQueryKey())

            type ItemsQueryData = Awaited<ReturnType<typeof getItems>> | undefined
            const itemsQueryData: ItemsQueryData = queryClient.getQueryData(itemsQueryKey())

            type QuantityUnitsData = Awaited<ReturnType<typeof getQuantityUnits>> | undefined
            const quantityUnitsQueryData: QuantityUnitsData = queryClient.getQueryData(quantityUnitsQueryKey())

            // Optimistically update to new value
            queryClient.setQueryData(singleRecipeQueryKey(payload.recipeId), (old: SingleRecipeQueryData) => {
                if (!old) {
                    return undefined
                }

                const getAddedItemCategory = () => {
                    // It its a new item and a new category, we don't have the id yet
                    if (payload.newCategory) {
                        return {
                            id: -1,
                            name: payload.newCategory
                        }
                    }

                    function getCategoryId() {
                        // If its a new item and therefore it is getting assigned a category on creation
                        if (payload.existingCategoryId) {
                            return Number(payload.existingCategoryId)
                        }

                        // If its an existing item, check the items list to see what it's category is (if it has a category)
                        const matchingItemCategory = itemsQueryData?.data.items.find(({ name }) => name === payload.itemName)?.category

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

                function getAddedItemQuantity(): RecipeItem['item_quantity'] {
                    return {
                        quantity: payload.quantity,
                        quantity_unit: payload.quantityUnitId
                            ? quantityUnitsQueryData?.data.quantity_units.find((quantityUnit) => quantityUnit.id === payload.quantityUnitId) || null
                            : null
                    }
                }

                const newItems: RecipeItem[] = [
                    ...old.data.recipe.items,
                    {
                        id: 0,
                        name: payload.itemName,
                        category: getAddedItemCategory(),
                        item_quantity: getAddedItemQuantity()
                    }
                ]

                const newData: SingleRecipeQueryData = {
                    data: {
                        recipe: {
                            ...old.data.recipe,
                            items: newItems.sort((a, b) => (a.name > b.name ? 1 : -1))
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleListQueryData: singleRecipeQueryData
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate affected queries on success
            queryClient.invalidateQueries({ queryKey: singleRecipeQueryKey(variables.recipeId) })
            queryClient.invalidateQueries({ queryKey: itemsQueryKey() })
        },
        onError: (err, variables, context) => {
            // Roll back to old data on error
            queryClient.setQueryData(singleRecipeQueryKey(variables.recipeId), context?.singleListQueryData)
        }
    })
}

/***** Remove item from recipe *****/
export function useRemoveItemFromRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const removeItemFromRecipe = ({ recipeId, itemId }: { recipeId: string; itemId: number }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/recipe/${recipeId}/remove-item`, { item_id: itemId })

    return useMutation({
        mutationFn: removeItemFromRecipe,
        onMutate: (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleRecipeQueryKey(payload.recipeId) })

            // Snapshot the data of the current queries
            type SingleRecipeQueryData = Awaited<ReturnType<typeof getSingleRecipe>> | undefined
            const singleRecipeQueryData: SingleRecipeQueryData = queryClient.getQueryData(singleRecipeQueryKey(payload.recipeId))

            // Optimistically update to new value
            queryClient.setQueryData(singleRecipeQueryKey(payload.recipeId), (old: SingleRecipeQueryData) => {
                if (!old) {
                    return undefined
                }

                const newData: SingleRecipeQueryData = {
                    data: {
                        recipe: {
                            ...old.data.recipe,
                            items: old.data.recipe.items.filter((item) => item.id !== payload.itemId)
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleListQueryData: singleRecipeQueryData
            }
        },
        onSuccess: (data, variables) => {
            // "isMutating" seems to return 1 for the current mutation even in the on success handler. If "isMutating" is greater than 1, that means that previous deletions are still happening. So we only want to invalidate the cache if its the last deletion
            if (queryClient.isMutating() < 2) {
                queryClient.invalidateQueries({ queryKey: singleRecipeQueryKey(variables.recipeId) })
            }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(singleRecipeQueryKey(variables.recipeId), context?.singleListQueryData)
            // fireErrorNotification(err)
        }
    })
}

/***** Edit recipe *****/
export function useEditRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const editRecipe = async ({
        recipeId,
        attributes,
        newRecipeCategory
    }: {
        recipeId: string
        attributes: EditRecipePayload
        newRecipeCategory: string
    }): Promise<MutationResponse> => {
        const body: NewRecipe = {
            name: attributes.name,
            prep_time: attributes.prep_time,
            serves: attributes.serves,
            instructions: attributes.instructions,
            recipe_category_id: attributes.recipe_category_id
        }

        if (newRecipeCategory) {
            // If this errors we can just let it throw and the query will stop executing and return an error
            const response = await axiosInstance.post<{ name: string }, AxiosResponse<{ recipe_category: { id: number } }>>('/api/recipe-category', {
                name: newRecipeCategory
            })

            const newRecipeCategoryId = response.data.recipe_category.id

            body.recipe_category_id = newRecipeCategoryId
        }

        return axiosInstance.put(`/api/recipe/${recipeId}`, body)
    }

    return useMutation({
        mutationFn: editRecipe,
        onMutate: (payload) => {
            return {
                isNewRecipeCategoryCreated: !!payload.newRecipeCategory
            }
        },
        onSuccess: (res, variables, context) => {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
            queryClient.invalidateQueries({ queryKey: menusQueryKey() })

            if (context.isNewRecipeCategoryCreated) {
                queryClient.invalidateQueries({ queryKey: recipeCategoriesQueryKey() })
            }
        }
    })
}

/***** Duplicate recipe *****/
export function useDuplicateRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const duplicateRecipe = ({
        recipeId,
        attributes
    }: {
        recipeId: string
        attributes: { name: string }
    }): Promise<MutationResponse<{ new_recipe_id: number }>> => axiosInstance.post(`/api/recipe/${recipeId}/duplicate`, attributes)

    return useMutation({
        mutationFn: duplicateRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
        }
    })
}

/***** Update item quantity *****/
export function useUpdateRecipeItemQuantityMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const updateRecipeItemQuantity = ({
        recipeId,
        attributes
    }: {
        recipeId: string
        attributes: UpdateRecipeItemQuantityPayload
    }): Promise<MutationResponse> => axiosInstance.put(`/api/recipe/${recipeId}/update-item-quantity`, attributes)

    return useMutation({
        mutationFn: updateRecipeItemQuantity,
        onSuccess(data, variables) {
            queryClient.setQueryData(
                singleRecipeQueryKey(variables.recipeId || ''),
                (old: Awaited<ReturnType<typeof getSingleRecipe>> | undefined) => {
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
                            recipe: {
                                ...old.data.recipe,
                                items: old.data.recipe.items.map((item) => {
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
                }
            )

            queryClient.invalidateQueries({ queryKey: singleRecipeQueryKey(variables.recipeId || '') })
        }
    })
}

/***** Share recipe *****/
export function useCreateShareRecipeRequestMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const createShareRecipeRequest = ({ recipeId, email }: { recipeId: number; email: string }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/recipe/${recipeId}/create-share-request`, { email })

    return useMutation({
        mutationFn: createShareRecipeRequest
    })
}

/***** Accept shared recipe *****/
export function useAcceptSharedRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const acceptSharedRecipe = ({
        newRecipeName,
        shareRequestId
    }: {
        newRecipeName: string
        shareRequestId: number
    }): Promise<MutationResponse<{ new_recipe_id: number }>> =>
        axiosInstance.post(`/api/recipe/accept-share-request/${shareRequestId}`, { name: newRecipeName })

    return useMutation({
        mutationFn: acceptSharedRecipe
    })
}

/***** Upload recipe image *****/
export function useUploadRecipeImageMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const uploadRecipeImage = ({ id, formData }: { id: string; formData: FormData }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/recipe/${id}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    return useMutation({
        mutationFn: uploadRecipeImage
    })
}

/***** Remove recipe image *****/
export function useRemoveRecipeImageMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const removeRecipeImage = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/recipe/${id}/remove-image`)

    return useMutation({
        mutationFn: removeRecipeImage,
        onSuccess: (_, recipeId) => {
            queryClient.invalidateQueries({ queryKey: singleRecipeQueryKey(recipeId) })
        }
    })
}

/***** Import recipe from image *****/
export function useImportRecipeFromImageMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const importRecipeFromImage = (formData: FormData): Promise<MutationResponse<{ imported_recipe: string[] }>> =>
        axiosInstance.post('/api/recipe/import-from-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    return useMutation({
        mutationFn: importRecipeFromImage
    })
}

/***** Confirm imported recipe *****/
export function useConfirmImportedRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const confirmImportedRecipe = ({
        newRecipeData,
        importedRecipeId
    }: {
        newRecipeData: ConfirmImportedRecipePayload
        importedRecipeId: number
    }): Promise<MutationResponse<{ new_recipe_id: number }>> =>
        axiosInstance.post(`/api/recipe/confirm-import-from-chrome-extension/${importedRecipeId}`, newRecipeData)

    return useMutation({
        mutationFn: confirmImportedRecipe
    })
}
