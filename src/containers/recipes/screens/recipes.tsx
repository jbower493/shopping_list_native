import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Form/Input'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { getExistingRecipeCategories } from '../../../utils/functions'
import { CategoryTag } from '../../../components/CategoryTag'

function Link() {
    return <Text>Link</Text>
}

export function RecipesScreen() {
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
                <View key={recipeCategoryId}>
                    <View>
                        <CategoryTag
                            categoriesData={recipeCategoriesOfExistingRecipes.filter(({ id }) => id !== -1)}
                            categoryName={recipeCategoryName}
                        />
                        {recipeCategoryId === -1 ? <Text>Edit the recipe to assign it to a category</Text> : null}
                    </View>
                    {/* <ul>
                        {recipeslist.map((recipe) => (
                            <div key={recipe.id} className='flex justify-between w-full max-w-md mb-2'>
                                <Link to={`/recipes/edit/${recipe.id}`} className='text-black hover:text-black'>
                                    {recipe.name}
                                </Link>
                                <div>
                                    <button className='mr-4' type='button' onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>
                                        <PencilSquareIcon className='w-5 text-primary hover:text-primary-hover' />
                                    </button>
                                    <button type='button' onClick={() => navigate(`/recipes/delete/${recipe.id}`)}>
                                        <TrashIcon className='w-5 text-primary hover:text-primary-hover' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul> */}
                </View>
            )
        }

        return recipeCategoriesOfExistingRecipes.map(({ id, name }) => renderRecipeCategory(id, name))
    }

    const noRecipesMessage = search
        ? 'No recipes matched your search.'
        : 'You don\'t currently have any recipes. Use the "Add New" button to create a recipe.'

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Recipes</Text>
            <View style={styles.buttonContainer}>
                <Button title='Add New' onPress={() => {}} />
                <Input containerStyle={styles.search} placeholder='Search for a recipe' value={search} onChangeText={(text) => setSearch(text)} />
            </View>
            {filteredRecipes.length > 0 ? renderCurrentRecipes() : <Text style={styles.noRecipeMessage}>{noRecipesMessage}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 20,
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
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    search: {
        width: 220
    },
    noRecipeMessage: {
        marginTop: 30
    }
})
