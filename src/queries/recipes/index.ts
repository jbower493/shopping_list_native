import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient
    // useMutation
} from '@tanstack/react-query'
import {
    DetailedRecipe,
    NewRecipe,
    Recipe
    // NewRecipe,
    // DetailedRecipe,
    // AddItemToRecipePayload,
    // EditRecipePayload,
    // RecipeItem,
    // UpdateRecipeItemQuantityPayload,
    // ConfirmImportedRecipePayload
} from './types'
import type {
    MutationResponse,
    QueryResponse
    // MutationResponse
} from '../utils/types'
import { QueryKeySet } from '../utils/keyFactory'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { AxiosInstance } from 'axios'
// import { fireErrorNotification, queryClient } from '../utils/queryClient'
// import { categoriesQueryKey, getCategories } from 'containers/categories/queries'
// import { getItems, itemsQueryKey } from 'containers/items/queries'
// import { getQuantityUnits, quantityUnitsQueryKey } from 'containers/quantityUnits/queries'
// import { QuantityUnit } from 'containers/quantityUnits/types'

const recipesKeySet = new QueryKeySet('Recipe')

/***** Get recipes *****/
// export type GetRecipesReturnType = ReturnType<typeof getRecipes>
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

    const createRecipe = (newRecipe: NewRecipe): Promise<MutationResponse<{ recipe_id: number }>> => axiosInstance.post('/api/recipe', newRecipe)

    return useMutation({
        mutationFn: createRecipe,
        onSuccess(res) {
            queryClient.invalidateQueries({ queryKey: recipesQueryKey() })
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

// /***** Add item to recipe *****/
// const addItemToRecipe = ({ recipeId, itemName, categoryId, quantity, quantityUnitId }: AddItemToRecipePayload): Promise<MutationResponse> => {
//     const body: { item_name: string; category_id?: string; quantity: number; quantity_unit_id?: number } = { item_name: itemName, quantity }

//     if (categoryId) body.category_id = categoryId
//     if (quantityUnitId) body.quantity_unit_id = quantityUnitId

//     return axios.post(`/recipe/${recipeId}/add-item`, body)
// }

// export function useAddItemToRecipeMutation() {
//     return useMutation({
//         mutationFn: addItemToRecipe,
//         onMutate: async (payload) => {
//             // Cancel any outgoing refetches so they don't overwrite our optimistic update
//             queryClient.cancelQueries(singleRecipeQueryKey(payload.recipeId))

//             // Snapshot the data of the current queries
//             type SingleRecipeQueryData = Awaited<ReturnType<typeof getSingleRecipe>> | undefined
//             const singleRecipeQueryData: SingleRecipeQueryData = queryClient.getQueryData(singleRecipeQueryKey(payload.recipeId))

//             type CategoriesQueryData = Awaited<ReturnType<typeof getCategories>> | undefined
//             const categoriesQueryData: CategoriesQueryData = queryClient.getQueryData(categoriesQueryKey())

//             type ItemsQueryData = Awaited<ReturnType<typeof getItems>> | undefined
//             const itemsQueryData: ItemsQueryData = queryClient.getQueryData(itemsQueryKey())

//             type QuantityUnitsData = Awaited<ReturnType<typeof getQuantityUnits>> | undefined
//             const quantityUnitsQueryData: QuantityUnitsData = queryClient.getQueryData(quantityUnitsQueryKey())

//             // Optimistically update to new value
//             queryClient.setQueryData(singleRecipeQueryKey(payload.recipeId), (old: SingleRecipeQueryData) => {
//                 if (!old) return undefined

//                 const getAddedItemCategory = () => {
//                     function getCategoryId() {
//                         // If its a new item and therefore it is getting assigned a category on creation
//                         if (payload.categoryId) return Number(payload.categoryId)

//                         // If its an existing item, check the items list to see what it's category is (if it has a category)
//                         const matchingItemCategory = itemsQueryData?.data.items.find(({ name }) => name === payload.itemName)?.category

//                         return matchingItemCategory?.id || null
//                     }

//                     const categoryId = getCategoryId()

//                     if (!categoryId) return null
//                     return {
//                         id: categoryId,
//                         name: categoriesQueryData?.data.categories.find(({ id }) => id === categoryId)?.name || ''
//                     }
//                 }

//                 function getAddedItemQuantity(): RecipeItem['item_quantity'] {
//                     return {
//                         quantity: payload.quantity,
//                         quantity_unit: payload.quantityUnitId
//                             ? quantityUnitsQueryData?.data.quantity_units.find((quantityUnit) => quantityUnit.id === payload.quantityUnitId) || null
//                             : null
//                     }
//                 }

//                 const newItems: RecipeItem[] = [
//                     ...old.data.recipe.items,
//                     {
//                         id: 0,
//                         name: payload.itemName,
//                         category: getAddedItemCategory(),
//                         item_quantity: getAddedItemQuantity()
//                     }
//                 ]

//                 const newData: SingleRecipeQueryData = {
//                     data: {
//                         recipe: {
//                             ...old.data.recipe,
//                             items: newItems.sort((a, b) => (a.name > b.name ? 1 : -1))
//                         }
//                     },
//                     message: old.message
//                 }

//                 return newData
//             })

//             // Return context object with the current data
//             return {
//                 singleListQueryData: singleRecipeQueryData
//             }
//         },
//         onSuccess: (data, variables) => {
//             // Invalidate affected queries on success
//             queryClient.invalidateQueries(singleRecipeQueryKey(variables.recipeId))
//             queryClient.invalidateQueries(itemsQueryKey())
//         },
//         onError: (err, variables, context) => {
//             // Roll back to old data on error
//             queryClient.setQueryData(singleRecipeQueryKey(variables.recipeId), context?.singleListQueryData)
//             fireErrorNotification(err)
//         }
//     })
// }

// /***** Remove item from recipe *****/
// const removeItemFromRecipe = ({ recipeId, itemId }: { recipeId: string; itemId: number }): Promise<MutationResponse> =>
//     axios.post(`/recipe/${recipeId}/remove-item`, { item_id: itemId })

// export function useRemoveItemFromRecipeMutation() {
//     return useMutation({
//         mutationFn: removeItemFromRecipe,
//         onMutate: (payload) => {
//             // Cancel any outgoing refetches so they don't overwrite our optimistic update
//             queryClient.cancelQueries(singleRecipeQueryKey(payload.recipeId))

//             // Snapshot the data of the current queries
//             type SingleRecipeQueryData = Awaited<ReturnType<typeof getSingleRecipe>> | undefined
//             const singleRecipeQueryData: SingleRecipeQueryData = queryClient.getQueryData(singleRecipeQueryKey(payload.recipeId))

//             // Optimistically update to new value
//             queryClient.setQueryData(singleRecipeQueryKey(payload.recipeId), (old: SingleRecipeQueryData) => {
//                 if (!old) return undefined

//                 const newData: SingleRecipeQueryData = {
//                     data: {
//                         recipe: {
//                             ...old.data.recipe,
//                             items: old.data.recipe.items.filter((item) => item.id !== payload.itemId)
//                         }
//                     },
//                     message: old.message
//                 }

//                 return newData
//             })

//             // Return context object with the current data
//             return {
//                 singleListQueryData: singleRecipeQueryData
//             }
//         },
//         onSuccess: (data, variables) => {
//             // "isMutating" seems to return 1 for the current mutation even in the on success handler. If "isMutating" is greater than 1, that means that previous deletions are still happening. So we only want to invalidate the cache if its the last deletion
//             if (queryClient.isMutating() < 2) {
//                 queryClient.invalidateQueries(singleRecipeQueryKey(variables.recipeId))
//             }
//         },
//         onError: (err, variables, context) => {
//             queryClient.setQueryData(singleRecipeQueryKey(variables.recipeId), context?.singleListQueryData)
//             fireErrorNotification(err)
//         }
//     })
// }

// /***** Edit recipe *****/
// const editRecipe = ({ recipeId, attributes }: { recipeId: string; attributes: EditRecipePayload }): Promise<MutationResponse> =>
//     axios.put(`/recipe/${recipeId}`, attributes)

// export function useEditRecipeMutation() {
//     return useMutation({
//         mutationFn: editRecipe
//     })
// }

// /***** Duplicate recipe *****/
// const duplicateRecipe = ({
//     recipeId,
//     attributes
// }: {
//     recipeId: string
//     attributes: { name: string }
// }): Promise<MutationResponse<{ new_recipe_id: number }>> => axios.post(`/recipe/${recipeId}/duplicate`, attributes)

// export function useDuplicateRecipeMutation() {
//     return useMutation({
//         mutationFn: duplicateRecipe
//     })
// }

// /***** Update item quantity *****/
// const updateRecipeItemQuantity = ({
//     recipeId,
//     attributes
// }: {
//     recipeId: string
//     attributes: UpdateRecipeItemQuantityPayload
// }): Promise<MutationResponse> => axios.put(`/recipe/${recipeId}/update-item-quantity`, attributes)

// export function useUpdateRecipeItemQuantityMutation() {
//     return useMutation({
//         mutationFn: updateRecipeItemQuantity,
//         onSuccess(data, variables) {
//             queryClient.setQueryData(
//                 singleRecipeQueryKey(variables.recipeId || ''),
//                 (old: Awaited<ReturnType<typeof getSingleRecipe>> | undefined) => {
//                     if (!old) return undefined

//                     function getNewQuantityUnit() {
//                         const sentQuanityUnitId = variables.attributes.quantity_unit_id

//                         if (!variables.attributes.quantity_unit_id) {
//                             return null
//                         }

//                         type QuantityUnitsData = Awaited<ReturnType<typeof getQuantityUnits>> | undefined
//                         const quantityUnitsQueryData: QuantityUnitsData = queryClient.getQueryData(quantityUnitsQueryKey())

//                         const foundUnit = quantityUnitsQueryData?.data.quantity_units.find((unit) => unit.id === sentQuanityUnitId)

//                         if (!foundUnit?.name || !foundUnit?.symbol) {
//                             return null
//                         }

//                         const newUnit = {
//                             id: sentQuanityUnitId,
//                             name: foundUnit?.name,
//                             symbol: foundUnit?.symbol
//                         } as QuantityUnit

//                         return newUnit
//                     }

//                     const newData = {
//                         ...old,
//                         data: {
//                             recipe: {
//                                 ...old.data.recipe,
//                                 items: old.data.recipe.items.map((item) => {
//                                     if (item.id !== Number(variables.attributes.item_id)) {
//                                         return item
//                                     }

//                                     return {
//                                         ...item,
//                                         item_quantity: {
//                                             quantity: Number(variables.attributes.quantity),
//                                             quantity_unit: getNewQuantityUnit()
//                                         }
//                                     }
//                                 })
//                             }
//                         }
//                     }

//                     return newData
//                 }
//             )

//             queryClient.invalidateQueries(singleRecipeQueryKey(variables.recipeId || ''))
//         }
//     })
// }

// /***** Accept shared recipe *****/
// const createShareRecipeRequest = ({ recipeId, email }: { recipeId: number; email: string }): Promise<MutationResponse> =>
//     axios.post(`/recipe/${recipeId}/create-share-request`, { email })

// export function useCreateShareRecipeRequestMutation() {
//     return useMutation({
//         mutationFn: createShareRecipeRequest
//     })
// }

// /***** Accept shared recipe *****/
// const acceptSharedRecipe = ({
//     newRecipeName,
//     shareRequestId
// }: {
//     newRecipeName: string
//     shareRequestId: number
// }): Promise<MutationResponse<{ new_recipe_id: number }>> => axios.post(`/recipe/accept-share-request/${shareRequestId}`, { name: newRecipeName })

// export function useAcceptSharedRecipeMutation() {
//     return useMutation({
//         mutationFn: acceptSharedRecipe
//     })
// }

// /***** Upload recipe image *****/
// const uploadRecipeImage = ({ id, formData }: { id: string; formData: FormData }): Promise<MutationResponse> =>
//     axios.post(`/recipe/${id}/upload-image`, formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })

// export function useUploadRecipeImageMutation() {
//     return useMutation({
//         mutationFn: uploadRecipeImage
//     })
// }

// /***** Remove recipe image *****/
// const removeRecipeImage = (id: string): Promise<MutationResponse> => axios.delete(`/recipe/${id}/remove-image`)

// export function useRemoveRecipeImageMutation() {
//     return useMutation({
//         mutationFn: removeRecipeImage
//     })
// }

// /***** Import recipe from image *****/
// const importRecipeFromImage = (formData: FormData): Promise<MutationResponse<{ imported_recipe: string[] }>> =>
//     axios.post('/recipe/import-from-image', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })

// export function useImportRecipeFromImageMutation() {
//     return useMutation({
//         mutationFn: importRecipeFromImage
//     })
// }

// /***** Confirm imported recipe *****/
// const confirmImportedRecipe = ({
//     newRecipeData,
//     importedRecipeId
// }: {
//     newRecipeData: ConfirmImportedRecipePayload
//     importedRecipeId: number
// }): Promise<MutationResponse<{ new_recipe_id: number }>> =>
//     axios.post(`/recipe/confirm-import-from-chrome-extension/${importedRecipeId}`, newRecipeData)

// export function useConfirmImportedRecipeMutation() {
//     return useMutation({
//         mutationFn: confirmImportedRecipe
//     })
// }
