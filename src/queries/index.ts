import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import { recipeCategoriesQueryKey, useRecipeCategoriesQuery } from './recipeCategories'
import { recipesQueryKey, useRecipesQuery } from './recipes'

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
        }
    },
    recipeCategories: {
        all: {
            useQuery: useRecipeCategoriesQuery,
            queryKey: recipeCategoriesQueryKey
        }
    }
}
