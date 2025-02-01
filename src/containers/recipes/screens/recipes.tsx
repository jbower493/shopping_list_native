import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Input } from '../../../components/Form/Input'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { getExistingRecipeCategories } from '../../../utils/functions'
import { CategoryTag } from '../../../components/CategoryTag'
import { Link } from '../../../components/Link'
import { DeleteRecipe } from '../components/deleteRecipe'
import { NewRecipe } from '../components/newRecipe'
import { useNavigation } from '@react-navigation/native'
import { semantic } from '../../../designTokens'

export function RecipesScreen() {
    const navigation = useNavigation()

    const [search, setSearch] = useState('')

    const { data: getRecipesData, isFetching: isGetRecipesFetching, isError: isGetRecipesError } = query.recipes.all.useQuery()

    const {
        data: getRecipeCategoriesData,
        isFetching: isGetRecipeCategoriesFetching,
        isError: isGetRecipeCategoriesError
    } = query.recipeCategories.all.useQuery()

    if (isGetRecipesFetching || isGetRecipeCategoriesFetching) {
        return <FullScreenLoader />
    }

    if (isGetRecipesError || !getRecipesData || !getRecipeCategoriesData || isGetRecipeCategoriesError) {
        return (
            <View>
                <Text>Recipes error</Text>
            </View>
        )
    }

    const filteredRecipes = getRecipesData.filter((recipe) => recipe.name.toLowerCase().includes(search.toLowerCase()))

    const renderCurrentRecipes = () => {
        // Get a unique list of all the recipe categories present in the existing recipes
        const recipeCategoriesOfExistingRecipes = getExistingRecipeCategories(filteredRecipes)

        const renderRecipeCategory = (recipeCategoryId: number, recipeCategoryName: string) => {
            let recipeslist = filteredRecipes.filter(({ recipe_category }) => !recipe_category)

            if (recipeCategoryId !== -1) {
                recipeslist = filteredRecipes.filter(({ recipe_category }) => recipe_category?.id === recipeCategoryId)
            }

            // TODO: remove this once the recipes are being sorted already by the backend
            recipeslist.sort()

            return (
                <View style={styles.category} key={recipeCategoryId}>
                    <View>
                        <CategoryTag
                            categoriesData={recipeCategoriesOfExistingRecipes.filter(({ id }) => id !== -1)}
                            categoryName={recipeCategoryName}
                        />
                        {recipeCategoryId === -1 ? (
                            <Text style={styles.uncategorizedInstructions}>Edit the recipe to assign it to a category</Text>
                        ) : null}
                    </View>
                    {recipeslist.map((recipe) => (
                        <View style={styles.recipe} key={recipe.id}>
                            <Link onPress={() => navigation.navigate('SingleRecipe', { recipeId: recipe.id })}>
                                <Text>{recipe.name}</Text>
                            </Link>
                            <DeleteRecipe recipeId={recipe.id} recipeName={recipe.name} />
                        </View>
                    ))}
                </View>
            )
        }

        return (
            <FlatList
                data={recipeCategoriesOfExistingRecipes}
                keyExtractor={(recipeCategory) => recipeCategory.id.toString()}
                renderItem={({ item: recipeCategory }) => renderRecipeCategory(recipeCategory.id, recipeCategory.name)}
            />
        )
    }

    const noRecipesMessage = search
        ? 'No recipes matched your search.'
        : 'You don\'t currently have any recipes. Use the "Add New" button to create a recipe.'

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Recipes</Text>
            <View style={styles.buttonContainer}>
                <NewRecipe />
                <Input containerStyle={styles.search} placeholder='Search for a recipe' value={search} onChangeText={(text) => setSearch(text)} />
            </View>
            <View style={styles.bottomContainer}>{filteredRecipes.length > 0 ? renderCurrentRecipes() : <Text>{noRecipesMessage}</Text>}</View>
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
    search: {
        width: 220
    },
    bottomContainer: {
        flex: 1,
        marginTop: 20
    },
    uncategorizedInstructions: {
        opacity: 0.6,
        marginTop: 4
    },
    category: {
        marginTop: 22
    },
    recipe: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 7
    }
})
