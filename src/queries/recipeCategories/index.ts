import {
    useQuery
    // useMutation
} from '@tanstack/react-query'
import {
    RecipeCategory
    // NewRecipeCategory, EditRecipeCategoryPayload
} from '../recipeCategories/types'
import { QueryKeySet } from '../utils/keyFactory'
import type {
    // MutationResponse,
    QueryResponse
} from '../utils/types'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'

const recipeCategoriesKeySet = new QueryKeySet('RecipeCategory')

/***** Get recipe categories *****/
export const recipeCategoriesQueryKey = recipeCategoriesKeySet.many

export function useRecipeCategoriesQuery() {
    const { axiosInstance } = useContext(FetchContext)

    const getRecipeCategories = (): Promise<QueryResponse<{ recipe_categories: RecipeCategory[] }>> => axiosInstance.get('/api/recipe-category')

    return useQuery({
        queryKey: recipeCategoriesQueryKey(),
        queryFn: getRecipeCategories,
        select: (res) => res.data.recipe_categories
    })
}

// export function prefetchGetRecipeCategoriesQuery() {
//     queryClient.prefetchQuery({ queryKey: recipeCategoriesQueryKey(), queryFn: getRecipeCategories })
// }

// /***** Create recipe category *****/
// const createRecipeCategory = (newRecipeCategory: NewRecipeCategory): Promise<MutationResponse> => axios.post('/recipe-category', newRecipeCategory)

// export function useCreateRecipeCategoryMutation() {
//     return useMutation({
//         mutationFn: createRecipeCategory
//     })
// }

// /***** Delete recipe category *****/
// const deleteRecipeCategory = (id: string): Promise<MutationResponse> => axios.delete(`/recipe-category/${id}`)

// export function useDeleteRecipeCategoryMutation() {
//     return useMutation({
//         mutationFn: deleteRecipeCategory
//     })
// }

// /***** Edit recipe category *****/
// const editRecipeCategory = ({
//     recipeCategoryId,
//     attributes
// }: {
//     recipeCategoryId: string
//     attributes: EditRecipeCategoryPayload
// }): Promise<MutationResponse> => axios.put(`/recipe-category/${recipeCategoryId}`, attributes)

// export function useEditRecipeCategoryMutation() {
//     return useMutation({
//         mutationFn: editRecipeCategory
//     })
// }
