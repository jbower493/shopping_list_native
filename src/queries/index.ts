import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import { recipeCategoriesQueryKey, useRecipeCategoriesQuery } from './recipeCategories'
import { recipesQueryKey, useDeleteRecipeMutation, useRecipesQuery } from './recipes'

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
            delete: {
                useMutation: useDeleteRecipeMutation
            }
        }
    },
    recipeCategories: {
        all: {
            useQuery: useRecipeCategoriesQuery,
            queryKey: recipeCategoriesQueryKey
        }
    }
}
