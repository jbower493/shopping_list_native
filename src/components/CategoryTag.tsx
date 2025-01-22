import React from 'react'
import { getCategoryColor, getRecipeCategoryColor } from '../utils/functions'
import type { Category } from '../queries/categories/types'
import { RecipeCategory } from '../queries/recipeCategories/types'
import { StyleSheet, Text } from 'react-native'

interface CategoryTagProps {
    categoriesData: Category[] | RecipeCategory[]
    categoryName: string
    size?: 'sm' | 'md'
    className?: string
    isRecipeCategory?: boolean
}

export function CategoryTag({ categoriesData, categoryName, size, className, isRecipeCategory }: CategoryTagProps) {
    const getSize = () => {
        if (size === 'sm') {
            return 'px-2 h-5 text-xs'
        }
        if (size === 'md') {
            return 'px-3 h-6 text-sm'
        }
        return 'px-4 h-7'
    }

    return (
        <Text
            style={styles.tag}
            // className={`flex items-center rounded-full pb-[1px] w-fit ${getSize()} ${
            //     !isRecipeCategory ? getCategoryColor(categoriesData, categoryName) : getRecipeCategoryColor(categoriesData, categoryName)
            // } text-white ${className}`}
        >
            {categoryName}
        </Text>
    )
}

const styles = StyleSheet.create({
    tag: {
        alignItems: 'center',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 40,
        height: 20
        // padding: '0 10'
    }
})
