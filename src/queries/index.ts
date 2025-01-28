import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import { quantityUnitsQueryKey, useQuantityUnitsQuery } from './quantityUnits'
import { recipeCategoriesQueryKey, useRecipeCategoriesQuery } from './recipeCategories'
import {
    recipesQueryKey,
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
    }
}
