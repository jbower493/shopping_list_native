import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import { categoriesQueryKey, useCreateCategoryMutation, useGetCategoriesQuery } from './categories'
import { itemsQueryKey, useGetItemsQuery } from './items'
import { listsQueryKey, useCreateListMutation, useDeleteListMutation, useGetSingleListQuery, useListsQuery } from './lists'
import { quantityUnitsQueryKey, useQuantityUnitsQuery } from './quantityUnits'
import { recipeCategoriesQueryKey, useCreateRecipeCategoryMutation, useRecipeCategoriesQuery } from './recipeCategories'
import {
    recipesQueryKey,
    useAddItemToRecipeMutation,
    useCreateRecipeMutation,
    useCreateShareRecipeRequestMutation,
    useDeleteRecipeMutation,
    useDuplicateRecipeMutation,
    useEditRecipeMutation,
    useRecipesQuery,
    useRemoveItemFromRecipeMutation,
    useRemoveRecipeImageMutation,
    useSingleRecipeQuery,
    useUpdateRecipeItemQuantityMutation,
    useUploadRecipeImageMutation
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
    lists: {
        all: {
            useQuery: useListsQuery,
            queryKey: listsQueryKey
        },
        single: {
            useQuery: useGetSingleListQuery,
            delete: {
                useMutation: useDeleteListMutation
            }
        },
        create: {
            useMutation: useCreateListMutation
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
            },
            itemQuantity: {
                useMutation: useUpdateRecipeItemQuantityMutation
            },
            update: {
                useMutation: useEditRecipeMutation
            },
            duplicate: {
                useMutation: useDuplicateRecipeMutation
            },
            share: {
                useMutation: useCreateShareRecipeRequestMutation
            },
            uploadImage: {
                useMutation: useUploadRecipeImageMutation
            },
            removeImage: {
                useMutation: useRemoveRecipeImageMutation
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
        },
        create: {
            useMutation: useCreateRecipeCategoryMutation
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
        },
        create: {
            useMutation: useCreateCategoryMutation
        }
    }
}
