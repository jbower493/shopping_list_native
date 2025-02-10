import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { component, semantic } from '../../../designTokens'
import { EditRecipeCategory } from '../components/editRecipeCategory'
import { DeleteRecipeCategory } from '../components/deleteRecipeCategory'
import { NewRecipeCategory } from '../components/newRecipeCategory'

export function RecipeCategoriesScreen() {
    const {
        data: recipeCategoriesData,
        isFetching: isRecipeCategoriesFetching,
        isError: isRecipeCategoriesError
    } = query.recipeCategories.all.useQuery()

    if (isRecipeCategoriesFetching) {
        return <FullScreenLoader />
    }

    if (isRecipeCategoriesError || !recipeCategoriesData) {
        return (
            <View>
                <Text>Recipe Categories error</Text>
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Recipe Categories</Text>
            <View style={styles.buttonContainer}>
                <NewRecipeCategory />
            </View>
            <View style={styles.bottomContainer}>
                {recipeCategoriesData.length > 0 ? (
                    <FlatList
                        data={recipeCategoriesData}
                        keyExtractor={(list) => list.id.toString()}
                        renderItem={({ item: recipeCategory }) => (
                            <View style={styles.recipeCategory} key={recipeCategory.id}>
                                <Text>{recipeCategory.name}</Text>
                                <View style={styles.actions}>
                                    <EditRecipeCategory recipeCategory={recipeCategory} />
                                    <DeleteRecipeCategory recipeCategoryId={recipeCategory.id} recipeCategoryName={recipeCategory.name} />
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text>No recipe categories to display.</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: semantic.paddingDefault,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomContainer: {
        flex: 1,
        marginTop: 20
    },
    recipeCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 7
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: component.actions_gapDefault
    }
})
