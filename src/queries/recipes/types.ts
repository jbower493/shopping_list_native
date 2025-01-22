import { Category } from '../categories/types'
import { QuantityUnit } from '../quantityUnits/types'
import { RecipeCategory } from '../recipeCategories/types'

export interface Recipe {
    id: number
    name: string
    recipe_category: RecipeCategory | null
}

export interface NewRecipe {
    name: string
    instructions?: string
    recipe_category_id?: number | null
    prep_time: number | null
    serves: number | null
}

export interface DetailedRecipe {
    id: number
    name: string
    instructions: string | null
    items: RecipeItem[]
    recipe_category: RecipeCategory | null
    image_url: string | null
    prep_time: number | null
    serves: number | null
}

export interface AddItemToRecipePayload {
    recipeId: string
    itemName: string
    categoryId?: string
    quantity: number
    quantityUnitId?: number
}

export interface EditRecipePayload {
    name: string
    instructions?: string
    recipe_category_id?: number | null
    prep_time: number | null
    serves: number | null
}

export interface RecipeItem {
    id: number
    name: string
    item_quantity: {
        quantity: number
        quantity_unit: QuantityUnit | null
    }
    category: Category | null
}

export interface UpdateRecipeItemQuantityPayload {
    item_id: number
    quantity: number
    quantity_unit_id: number | null
}

export interface ConfirmImportedRecipePayload extends NewRecipe {
    items: {
        name: string
        quantity: number
        quantity_unit_id: number | null
        category_id?: number | null
    }[]
}
