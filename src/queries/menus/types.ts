import { Recipe } from '../recipes/types'

export interface Menu {
    id: number
    name: string
}

export interface NewMenu {
    name: string
}

export interface MenuRecipe extends Recipe {
    day_of_week: {
        day: string | null
    }
}

export interface DetailedMenu {
    id: number
    name: string
    recipes: MenuRecipe[]
}

export interface EditMenuPayload {
    name: string
}

export interface UpdateMenuRecipePayload {
    day: string | null
}

export interface AddRecipestoMenuPayload {
    menuId: string
    recipes: {
        id: string
        day: string | null
    }[]
}

export interface RandomRecipesPayload {
    recipe_categories: {
        id: 'ALL_CATEGORIES' | number
        quantity: number
    }[]
}

export interface RandomRecipesPreview {
    recipes: Recipe[]
}
