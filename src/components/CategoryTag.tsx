import React from 'react'
import { getCategoryColor } from '../utils/functions'
import type { Category } from '../queries/categories/types'
import { RecipeCategory } from '../queries/recipeCategories/types'
import { StyleSheet, Text, View } from 'react-native'

interface CategoryTagProps {
    categoriesData: Category[] | RecipeCategory[]
    categoryName: string
    size?: 'sm' | 'md'
    className?: string
}

export function CategoryTag({ categoriesData, categoryName }: CategoryTagProps) {
    // const getSize = () => {
    //     if (size === 'sm') {
    //         return 'px-2 h-5 text-xs'
    //     }
    //     if (size === 'md') {
    //         return 'px-3 h-6 text-sm'
    //     }
    //     return 'px-4 h-7'
    // }

    return (
        <View style={styles.container}>
            <Text style={[styles.tag, { backgroundColor: getCategoryColor(categoriesData, categoryName) }]}>{categoryName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    tag: {
        color: 'white',
        borderRadius: 40,
        height: 26,
        paddingHorizontal: 16,
        textAlignVertical: 'center',
        paddingBottom: 1
    }
})
