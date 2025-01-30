import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import { categoriesQueryKey, useGetCategoriesQuery } from './categories'
import { itemsQueryKey, useGetItemsQuery } from './items'
import { quantityUnitsQueryKey, useQuantityUnitsQuery } from './quantityUnits'
import { recipeCategoriesQueryKey, useRecipeCategoriesQuery } from './recipeCategories'
import {
    recipesQueryKey,
    useAddItemToRecipeMutation,
    useCreateRecipeMutation,
    useDeleteRecipeMutation,
    useRecipesQuery,
    useRemoveItemFromRecipeMutation,
    useSingleRecipeQuery
} from './recipes'

export const query = {
    auth: {
        user: {
            useQuery: useUserQuery,
            queryKey: userQueryKey
        },
        login: {
            useMutation: useLoginMutation
        },
        register: {
            useMutation: useRegisterMutation
        },
        logout: {
            useMutation: useLogoutMutation
        }
    },
    recipes: {
        all: {
            useQuery: useRecipesQuery,
            queryKey: recipesQueryKey
        },
        single: {
            useQuery: useSingleRecipeQuery,
            delete: {
                useMutation: useDeleteRecipeMutation
            },
            removeItem: {
                useMutation: useRemoveItemFromRecipeMutation
            },
            addItem: {
                useMutation: useAddItemToRecipeMutation
            }
        },
        create: {
            useMutation: useCreateRecipeMutation
        }
    },
    recipeCategories: {
        all: {
            useQuery: useRecipeCategoriesQuery,
            queryKey: recipeCategoriesQueryKey
        }
    },
    quantityUnits: {
        all: {
            useQuery: useQuantityUnitsQuery,
            queryKey: quantityUnitsQueryKey
        }
    },
    items: {
        all: {
            useQuery: useGetItemsQuery,
            queryKey: itemsQueryKey
        }
    },
    itemCategories: {
        all: {
            useQuery: useGetCategoriesQuery,
            queryKey: categoriesQueryKey
        }
    }
}
