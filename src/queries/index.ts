import {
    accountAccessQueryKey,
    additionalUsersQueryKey,
    useAccountAccessQuery,
    useAddAdditionalUserMutation,
    useAdditionalUsersQuery,
    useChangeEmailMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useLoginAsAnotherUserMutation,
    useRemoveAdditionalUserMutation
} from './account'
import { useLoginMutation, useLogoutMutation, useRegisterMutation, userQueryKey, useUserQuery } from './auth'
import {
    categoriesQueryKey,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useEditCategoryMutation,
    useGetCategoriesQuery
} from './categories'
import {
    itemsQueryKey,
    useCreateItemMutation,
    useDeleteItemMutation,
    useEditItemMutation,
    useGetItemsQuery,
    useUploadItemImageMutation
} from './items'
import {
    listsQueryKey,
    singleListQueryKey,
    useAddItemsFromMenuMutation,
    useAddItemsFromRecipeMutation,
    useAddItemToListMutation,
    useCreateListMutation,
    useDeleteListMutation,
    useEditListMutation,
    useGetSingleListQuery,
    useListsQuery,
    useRemoveItemFromListMutation,
    useUpdateListItemQuantityMutation
} from './lists'
import { menusQueryKey, singleMenuQueryKey, useCreateMenuMutation, useDeleteMenuMutation, useGetMenusQuery, useGetSingleMenuQuery } from './menus'
import { quantityUnitsQueryKey, useQuantityUnitsQuery } from './quantityUnits'
import {
    recipeCategoriesQueryKey,
    useCreateRecipeCategoryMutation,
    useDeleteRecipeCategoryMutation,
    useEditRecipeCategoryMutation,
    useRecipeCategoriesQuery
} from './recipeCategories'
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
    account: {
        changeEmail: {
            useMutation: useChangeEmailMutation
        },
        changePassword: {
            useMutation: useChangePasswordMutation
        },
        additionalUsers: {
            all: {
                useQuery: useAdditionalUsersQuery,
                queryKey: additionalUsersQueryKey
            },
            create: {
                useMutation: useAddAdditionalUserMutation
            },
            delete: {
                useMutation: useRemoveAdditionalUserMutation
            }
        },
        accountAccess: {
            all: {
                useQuery: useAccountAccessQuery,
                queryKey: accountAccessQueryKey
            },
            loginAsAnotherUser: {
                useMutation: useLoginAsAnotherUserMutation
            }
        },
        deleteAccount: {
            useMutation: useDeleteAccountMutation
        }
    },
    menus: {
        all: {
            useQuery: useGetMenusQuery,
            queryKey: menusQueryKey
        },
        single: {
            useQuery: useGetSingleMenuQuery,
            queryKey: singleMenuQueryKey,
            delete: {
                useMutation: useDeleteMenuMutation
            }
        },
        create: {
            useMutation: useCreateMenuMutation
        }
    },
    lists: {
        all: {
            useQuery: useListsQuery,
            queryKey: listsQueryKey
        },
        single: {
            useQuery: useGetSingleListQuery,
            queryKey: singleListQueryKey,
            delete: {
                useMutation: useDeleteListMutation
            },
            addItem: {
                useMutation: useAddItemToListMutation
            },
            removeItem: {
                useMutation: useRemoveItemFromListMutation
            },
            itemQuantity: {
                useMutation: useUpdateListItemQuantityMutation
            },
            addFromRecipe: {
                useMutation: useAddItemsFromRecipeMutation
            },
            addFromMenu: {
                useMutation: useAddItemsFromMenuMutation
            },
            update: {
                useMutation: useEditListMutation
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
        single: {
            update: {
                useMutation: useEditRecipeCategoryMutation
            },
            delete: {
                useMutation: useDeleteRecipeCategoryMutation
            }
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
        },
        single: {
            uploadImage: {
                useMutation: useUploadItemImageMutation
            },
            delete: {
                useMutation: useDeleteItemMutation
            },
            update: {
                useMutation: useEditItemMutation
            }
        },
        create: {
            useMutation: useCreateItemMutation
        }
    },
    itemCategories: {
        all: {
            useQuery: useGetCategoriesQuery,
            queryKey: categoriesQueryKey
        },
        single: {
            update: {
                useMutation: useEditCategoryMutation
            },
            delete: {
                useMutation: useDeleteCategoryMutation
            }
        },
        create: {
            useMutation: useCreateCategoryMutation
        }
    }
}
