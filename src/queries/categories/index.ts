import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import { Category, EditCategoryPayload, NewCategory } from './types'
import { MutationResponse, QueryResponse } from '../utils/types'
import { QueryKeySet } from '../utils/keyFactory'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'

const categoriesKeySet = new QueryKeySet('Category')

/***** Get categories *****/
export const getCategories = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ categories: Category[] }>> => axiosInstance.get('/api/category')
export const categoriesQueryKey = categoriesKeySet.many

export function useGetCategoriesQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: categoriesQueryKey(),
        queryFn: () => getCategories(axiosInstance),
        select: (res) => res.data.categories
    })
}

export function prefetchGetCategoriesQuery(axiosInstance: AxiosInstance, queryClient: QueryClient) {
    queryClient.prefetchQuery({ queryKey: categoriesQueryKey(), queryFn: () => getCategories(axiosInstance) })
}

/***** Create category *****/
export function useCreateCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const createCategory = (newCategory: NewCategory): Promise<MutationResponse> => axiosInstance.post('/api/category', newCategory)

    return useMutation({
        mutationFn: createCategory
    })
}

/***** Delete category *****/
export function useDeleteCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const deleteCategory = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/category/${id}`)

    return useMutation({
        mutationFn: deleteCategory
    })
}

/***** Edit category *****/
export function useEditCategoryMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const editCategory = ({ categoryId, attributes }: { categoryId: string; attributes: EditCategoryPayload }): Promise<MutationResponse> =>
        axiosInstance.put(`/api/category/${categoryId}`, attributes)

    return useMutation({
        mutationFn: editCategory
    })
}
