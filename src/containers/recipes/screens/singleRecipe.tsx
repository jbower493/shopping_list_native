import { useState } from 'react'
import { query } from '../../../queries'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { EditRecipeForm } from '../components/editRecipeForm'
import { MoreOptions } from '../components/moreOptions'
import { CategoryTag } from '../../../components/CategoryTag'
import { formatPrepTime } from '../../../utils/functions'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RecipesStackParamsList } from '../stackNavigator'
import { Link } from '../../../components/Link'
import { EditRecipeItem } from '../components/editRecipeItem'
import { AddItem } from '../components/addItem'
import { AddItemToRecipePayload } from '../../../queries/recipes/types'
import { RecipeImage } from '../components/recipeImage'

export function SingleRecipeScreen() {
    const [isEditRecipeFormOpen, setIsEditRecipeFormOpen] = useState(false)
    const [isInstructionsShowing, setIsInstructionsShowing] = useState<boolean>(true)

    const route = useRoute<RouteProp<RecipesStackParamsList, 'SingleRecipe'>>()
    const { recipeId } = route.params

    const { data: recipeCategoriesData, isFetching: isRecipeCategoriesFetching } = query.recipeCategories.all.useQuery()
    const {
        data: singleRecipeData,
        isPending: isSingleRecipeLoading,
        isError: isSingleRecipeError
    } = query.recipes.single.useQuery(recipeId.toString() || '')
    const { data: itemsData, isPending: isItemsLoading, isError: isItemsError } = query.items.all.useQuery()

    const { mutate: addItemToRecipe } = query.recipes.single.addItem.useMutation()

    if (isSingleRecipeLoading || isItemsLoading || isRecipeCategoriesFetching) {
        return <FullScreenLoader />
    }

    if (isSingleRecipeError || !singleRecipeData || isItemsError || !itemsData) {
        return (
            <View>
                <Text>Recipe error</Text>
            </View>
        )
    }

    const { name, id, items, instructions, recipe_category, prep_time, serves } = singleRecipeData

    const renderInstructions = () => {
        if (!isInstructionsShowing) {
            return null
        }

        return (
            <ScrollView style={styles.instructionsScrollView}>
                <Text style={styles.instructionsText}>{instructions || 'None set. Click the edit icon above to add some instructions.'}</Text>
            </ScrollView>
        )
    }

    const renderCurrentItems = () => {
        const sortedItemsList = [...items].sort((a, b) => (a.name > b.name ? 1 : -1))

        return (
            <View style={styles.currentItems}>
                <Text style={styles.currentItemsTitle}>Items</Text>
                <FlatList
                    data={sortedItemsList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <EditRecipeItem key={item.id} item={item} recipeId={id} />}
                />
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <View style={styles.topContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{name}</Text>
                    <Pressable style={styles.titleEditButton} onPress={() => setIsEditRecipeFormOpen(true)}>
                        <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
                    </Pressable>
                </View>
                <MoreOptions recipeId={recipeId} recipeName={singleRecipeData.name} />
            </View>
            <View style={styles.recipeMeta}>
                <CategoryTag categoriesData={recipeCategoriesData || []} categoryName={recipe_category?.name || 'Uncategorized'} />
                <View style={styles.recipeMetaItem}>
                    <MaterialCommunityIcon name='timer-outline' size={22} color={semantic.colorTextPrimary} />

                    <Text>{formatPrepTime(prep_time)}</Text>
                </View>
                <View style={styles.recipeMetaItem}>
                    <MaterialCommunityIcon name='account-multiple' size={22} color={semantic.colorTextPrimary} />

                    <Text>{serves || '?'}</Text>
                </View>
            </View>

            <RecipeImage recipeId={id} />

            <View style={styles.instructions}>
                <View style={styles.instructionsTitleContainer}>
                    <Text style={styles.instructionsTitle}>Instructions</Text>
                    <Link onPress={() => setIsInstructionsShowing((prev) => !prev)}>{isInstructionsShowing ? 'Hide' : 'Show'}</Link>
                    <Pressable style={styles.titleEditButton} onPress={() => setIsEditRecipeFormOpen(true)}>
                        <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
                    </Pressable>
                </View>
                {renderInstructions()}
            </View>

            <AddItem
                onAdd={(itemToAdd, newCategory, existingCategoryId, quantity, quantityUnitId) => {
                    const payload: AddItemToRecipePayload = { recipeId: id.toString(), itemName: itemToAdd, quantity }

                    if (newCategory) {
                        payload.newCategory = newCategory
                    } else if (existingCategoryId && existingCategoryId !== 'none') {
                        payload.existingCategoryId = existingCategoryId
                    }

                    if (quantityUnitId) {
                        payload.quantityUnitId = quantityUnitId
                    }

                    addItemToRecipe(payload)
                }}
                itemsList={itemsData || []}
            />

            {renderCurrentItems()}

            <EditRecipeForm recipeId={recipeId.toString()} isOpen={isEditRecipeFormOpen} setIsOpen={setIsEditRecipeFormOpen} />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: semantic.paddingDefault,
        justifyContent: 'flex-start',
        flex: 1,
        alignItems: 'flex-start'
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    titleEditButton: {
        marginTop: 3
    },
    recipeMeta: {
        marginTop: 15,
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
    },
    recipeMetaItem: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    instructions: {
        marginTop: 16,
        width: '100%'
    },
    instructionsTitleContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 600
    },
    instructionsText: {
        marginTop: 5
    },
    instructionsScrollView: { maxHeight: 300 },
    addItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    currentItems: {
        marginTop: 15,
        flex: 1
    },
    currentItemsTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 6
    }
})
