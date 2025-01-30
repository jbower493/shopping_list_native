import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { EditRecipeCategoryPayload, NewRecipeCategory, RecipeCategory } from '../recipeCategories/types'
import { QueryKeySet } from '../utils/keyFactory'
import type { MutationResponse, QueryResponse } from '../utils/types'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { AxiosInstance } from 'axios'

const recipeCategoriesKeySet = new QueryKeySet('RecipeCategory')

/***** Get recipe categories *****/
export const recipeCategoriesQueryKey = recipeCategoriesKeySet.many
const getRecipeCategories = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ recipe_categories: RecipeCategory[] }>> =>
    axiosInstance.get('/api/recipe-category')

export function useRecipeCategoriesQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: recipeCategoriesQueryKey(),
        queryFn: () => getRecipeCategories(axiosInstance),
        select: (res) => res.data.recipe_categories
    })
}

export function prefetchGetRecipeCategoriesQuery(queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({ queryKey: recipeCategoriesQueryKey(), queryFn: () => axiosInstance })
}

/***** Create recipe category *****/
export function useCreateRecipeCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const createRecipeCategory = (newRecipeCategory: NewRecipeCategory): Promise<MutationResponse> =>
        axiosInstance.post('/api/recipe-category', newRecipeCategory)

    return useMutation({
        mutationFn: createRecipeCategory
    })
}

/***** Delete recipe category *****/
export function useDeleteRecipeCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const deleteRecipeCategory = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/recipe-category/${id}`)

    return useMutation({
        mutationFn: deleteRecipeCategory
    })
}

/***** Edit recipe category *****/
export function useEditRecipeCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const editRecipeCategory = ({
        recipeCategoryId,
        attributes
    }: {
        recipeCategoryId: string
        attributes: EditRecipeCategoryPayload
    }): Promise<MutationResponse> => axiosInstance.put(`/api/recipe-category/${recipeCategoryId}`, attributes)

    return useMutation({
        mutationFn: editRecipeCategory
    })
}
