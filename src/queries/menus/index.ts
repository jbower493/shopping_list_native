import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query'
import { QueryKeySet } from '../utils/keyFactory'
import { MutationResponse, QueryResponse } from '../utils/types'
import {
    AddRecipestoMenuPayload,
    DetailedMenu,
    EditMenuPayload,
    Menu,
    MenuRecipe,
    NewMenu,
    RandomRecipesPayload,
    RandomRecipesPreview,
    UpdateMenuRecipePayload
} from './types'
import { GetRecipesReturnType, recipesQueryKey } from '../recipes'
import { FetchContext } from '../utils/fetchContext'
import { useContext } from 'react'
import { AxiosInstance } from 'axios'

const menusKeySet = new QueryKeySet('Menu')

/***** Get menus *****/
export const menusQueryKey = menusKeySet.many
const getMenus = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ menus: Menu[] }>> => axiosInstance.get('/api/menu')

export function useGetMenusQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: menusQueryKey(),
        queryFn: () => getMenus(axiosInstance),
        select: (res) => res.data.menus
    })
}

export function prefetchGetMenusQuery(queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({ queryKey: menusQueryKey(), queryFn: () => getMenus(axiosInstance) })
}

/***** Create menu *****/
export function useCreateMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const createMenu = (newMenu: NewMenu): Promise<MutationResponse<{ menu_id: number }>> => axiosInstance.post('/api/menu', newMenu)

    return useMutation({
        mutationFn: createMenu,
        onSuccess(res) {
            queryClient.invalidateQueries({ queryKey: menusQueryKey() })
            prefetchSingleMenuQuery(res.data?.menu_id.toString() || '', queryClient, axiosInstance)
        }
    })
}

/***** Delete menu *****/
export function useDeleteMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const deleteMenu = (id: string): Promise<MutationResponse> => axiosInstance.delete(`/api/menu/${id}`)

    return useMutation({
        mutationFn: deleteMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menusQueryKey() })
        }
    })
}

/***** Get single menu *****/
export const singleMenuQueryKey = menusKeySet.one
const getSingleMenu = (localId: string, axiosInstance: AxiosInstance): Promise<QueryResponse<{ menu: DetailedMenu }>> =>
    axiosInstance.get(`/api/menu/${localId}`)

export function useGetSingleMenuQuery(id: string) {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: singleMenuQueryKey(id),
        queryFn: () => getSingleMenu(id, axiosInstance),
        select: (res) => res.data.menu
    })
}

export function prefetchSingleMenuQuery(menuId: string, queryClient: QueryClient, axiosInstance: AxiosInstance) {
    queryClient.prefetchQuery({
        queryKey: singleMenuQueryKey(menuId),
        queryFn: () => getSingleMenu(menuId, axiosInstance)
    })
}

/***** Add recipe to menu *****/
export function useAddRecipesToMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const addRecipesToMenu = ({ menuId, recipes }: AddRecipestoMenuPayload): Promise<MutationResponse> =>
        axiosInstance.post(`/api/menu/${menuId}/add-recipes`, { recipes })

    return useMutation({
        mutationFn: addRecipesToMenu,
        onMutate: async (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleMenuQueryKey(payload.menuId) })

            // Snapshot the data of the current queries
            type SingleMenuQueryData = Awaited<ReturnType<typeof getSingleMenu>> | undefined
            const singleMenuQueryData: SingleMenuQueryData = queryClient.getQueryData(singleMenuQueryKey(payload.menuId))

            type RecipesQueryData = Awaited<GetRecipesReturnType> | undefined
            const recipesQueryData: RecipesQueryData = queryClient.getQueryData(recipesQueryKey())

            // Optimistically update to new value
            queryClient.setQueryData(singleMenuQueryKey(payload.menuId), (old: SingleMenuQueryData) => {
                if (!old) {
                    return undefined
                }

                const newRecipes: MenuRecipe[] = [...old.data.menu.recipes]

                // Loop through each recipe that was added and add each one to the existing query cache
                payload.recipes.forEach((payloadRecipe) => {
                    const addedRecipeData = recipesQueryData?.data.recipes.find(({ id }) => id === Number(payloadRecipe.id))

                    newRecipes.push({
                        id: Number(payloadRecipe.id),
                        name: addedRecipeData?.name || '',
                        day_of_week: {
                            day: payloadRecipe.day || null
                        },
                        recipe_category: addedRecipeData?.recipe_category || null
                    })
                })

                const newData: SingleMenuQueryData = {
                    data: {
                        menu: {
                            ...old.data.menu,
                            recipes: newRecipes
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleMenuQueryData: singleMenuQueryData
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate affected queries on success
            queryClient.invalidateQueries({ queryKey: singleMenuQueryKey(variables.menuId) })
        },
        onError: (err, variables, context) => {
            // Roll back to old data on error
            queryClient.setQueryData(singleMenuQueryKey(variables.menuId), context?.singleMenuQueryData)
        }
    })
}

/***** Remove recipe from menu *****/
export function useRemoveRecipeFromMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const removeRecipeFromMenu = ({ menuId, recipeId }: { menuId: string; recipeId: number }): Promise<MutationResponse> =>
        axiosInstance.post(`/api/menu/${menuId}/remove-recipe`, { recipe_id: recipeId })

    return useMutation({
        mutationFn: removeRecipeFromMenu,
        onMutate: (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleMenuQueryKey(payload.menuId) })

            // Snapshot the data of the current queries
            type SingleMenuQueryData = Awaited<ReturnType<typeof getSingleMenu>> | undefined
            const singleMenuQueryData: SingleMenuQueryData = queryClient.getQueryData(singleMenuQueryKey(payload.menuId))

            // Optimistically update to new value
            queryClient.setQueryData(singleMenuQueryKey(payload.menuId), (old: SingleMenuQueryData) => {
                if (!old) {
                    return undefined
                }

                const newData: SingleMenuQueryData = {
                    data: {
                        menu: {
                            ...old.data.menu,
                            recipes: old.data.menu.recipes.filter((recipe) => recipe.id !== payload.recipeId)
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleMenuQueryData: singleMenuQueryData
            }
        },
        onSuccess: (data, variables) => {
            // "isMutating" seems to return 1 for the current mutation even in the on success handler. If "isMutating" is greater than 1, that means that previous deletions are still happening. So we only want to invalidate the cache if its the last deletion
            if (queryClient.isMutating() < 2) {
                queryClient.invalidateQueries({
                    queryKey: singleMenuQueryKey(variables.menuId)
                })
            }
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(singleMenuQueryKey(variables.menuId), context?.singleMenuQueryData)
        }
    })
}

/***** Edit menu *****/
export function useEditMenuMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const editMenu = ({ menuId, attributes }: { menuId: string; attributes: EditMenuPayload }): Promise<MutationResponse> =>
        axiosInstance.put(`/api/menu/${menuId}`, attributes)

    return useMutation({
        mutationFn: editMenu
    })
}

/***** Update menu recipe *****/
export function useUpdateMenuRecipeMutation() {
    const { axiosInstance } = useContext(FetchContext)
    const queryClient = useQueryClient()

    const updateMenuRecipe = ({
        menuId,
        recipeId,
        attributes
    }: {
        menuId: string
        recipeId: string
        attributes: UpdateMenuRecipePayload
    }): Promise<MutationResponse> => axiosInstance.put(`/api/menu/${menuId}/update-menu-recipe/${recipeId}`, attributes)

    return useMutation({
        mutationFn: updateMenuRecipe,
        onMutate: async (payload) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            queryClient.cancelQueries({ queryKey: singleMenuQueryKey(payload.menuId) })

            // Snapshot the data of the current queries
            type SingleMenuQueryData = Awaited<ReturnType<typeof getSingleMenu>> | undefined
            const singleMenuQueryData: SingleMenuQueryData = queryClient.getQueryData(singleMenuQueryKey(payload.menuId))

            // Optimistically update to new value
            queryClient.setQueryData(singleMenuQueryKey(payload.menuId), (old: SingleMenuQueryData) => {
                if (!old) {
                    return undefined
                }

                const newRecipes: MenuRecipe[] = old.data.menu.recipes.map((recipe) =>
                    recipe.id === Number(payload.recipeId) ? { ...recipe, day_of_week: { day: payload.attributes.day } } : recipe
                )

                const newData: SingleMenuQueryData = {
                    data: {
                        menu: {
                            ...old.data.menu,
                            recipes: newRecipes
                        }
                    },
                    message: old.message
                }

                return newData
            })

            // Return context object with the current data
            return {
                singleMenuQueryData: singleMenuQueryData
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate affected queries on success
            queryClient.invalidateQueries({ queryKey: singleMenuQueryKey(variables.menuId) })
        },
        onError: (err, variables, context) => {
            // Roll back to old data on error
            queryClient.setQueryData(singleMenuQueryKey(variables.menuId), context?.singleMenuQueryData)
        }
    })
}

/***** Random recipes preview *****/
export function useRandomRecipesPreviewMutation() {
    const { axiosInstance } = useContext(FetchContext)

    const randomRecipesPreview = ({
        menuId,
        attributes
    }: {
        menuId: string
        attributes: RandomRecipesPayload
    }): Promise<MutationResponse<RandomRecipesPreview>> => axiosInstance.put(`/api/menu/${menuId}/random-recipes/preview`, attributes)

    return useMutation({
        mutationFn: randomRecipesPreview
    })
}
