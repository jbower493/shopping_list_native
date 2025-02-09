import type { Category } from '../queries/categories/types'
import type { Item } from '../queries/items/types'
import { RecipeCategory } from '../queries/recipeCategories/types'
import { Recipe } from '../queries/recipes/types'

export const getCategoryOptions = (categories: Category[] = []) => {
    const options = categories.map(({ id, name }) => ({
        label: name,
        value: id.toString()
    }))

    return [{ label: 'Uncategorized', value: 'none' }, ...options]
}

export const getRecipeCategoryOptions = (recipeCategories: RecipeCategory[] = []) => {
    const options = recipeCategories.map(({ id, name }) => ({
        label: name,
        value: id.toString()
    }))

    return [{ label: 'Uncategorized', value: 'none' }, ...options]
}

export const getCategoryColor = (categories: Category[] | RecipeCategory[], catName: string) => {
    const index = categories.findIndex(({ name }) => catName === name)
    const num = index % 6

    switch (num) {
        case 0:
            return '#fb2c36' // Red 500
        case 1:
            return '#ff6900' // Orange 500
        case 2:
            return '#7ccf00' // Lime 500
        case 3:
            return '#00a6f4' // Sky 500
        case 4:
            return '#e12afb' // Fuscia 500
        case 5:
            return '#615fff' // Indigo 500
        default:
            return '#99a1af' // Gray 400
    }
}

export const getExistingCategories = (itemsList: Item[]) => {
    const mapped = itemsList.map(({ category }) => category || { name: 'Uncategorized', id: -1 })
    const filtered = mapped.filter((category, index, arr) => arr.findIndex((categoryNested) => category.id === categoryNested.id) === index)
    const sorted = filtered.sort((a, b) => {
        if (b.id === -1) {
            return -1
        }
        if (a.id === -1) {
            return 1
        }
        return a.name.localeCompare(b.name)
    })

    return sorted
}

export const getExistingRecipeCategories = (recipesList: Recipe[]) => {
    const mapped = recipesList.map(({ recipe_category }) => recipe_category || { name: 'Uncategorized', id: -1 })
    const filtered = mapped.filter(
        (recipeCategory, index, arr) => arr.findIndex((recipeCategoryNested) => recipeCategory.id === recipeCategoryNested.id) === index
    )
    const sorted = filtered.sort((a, b) => {
        if (b.id === -1) {
            return -1
        }
        if (a.id === -1) {
            return 1
        }
        return a.name.localeCompare(b.name)
    })

    return sorted
}

export function formatPrepTime(time: number | null) {
    if (!time || !Number.isInteger(time)) {
        return '?'
    }

    if (time < 60) {
        return `${time} mins`
    }

    const mins = time % 60
    const hrs = (time - mins) / 60

    return `${hrs} ${hrs === 1 ? 'hr' : 'hrs'} ${mins} mins`
}

export function getFilteredRecipesByCategory(selectedRecipeCategoryId: string | undefined, recipesData: Recipe[]) {
    function filterFn({ recipe_category }: Recipe) {
        if (selectedRecipeCategoryId === 'ALL_CATEGORIES') {
            return true
        }

        if (recipe_category?.id === Number(selectedRecipeCategoryId)) {
            return true
        }

        if (!recipe_category && selectedRecipeCategoryId === 'none') {
            return true
        }

        return false
    }

    const list = (recipesData || []).filter(filterFn)

    return list.map(({ name }) => name)
}
