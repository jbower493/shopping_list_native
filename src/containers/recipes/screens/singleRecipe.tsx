import { useState } from 'react'
import { query } from '../../../queries'
import { Pressable, StyleSheet, Text, View } from 'react-native'
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

export function SingleRecipeScreen() {
    const [isEditRecipeFormOpen, setIsEditRecipeFormOpen] = useState(false)
    const [isInstructionsShowing, setIsInstructionsShowing] = useState<boolean>(true)

    const route = useRoute<RouteProp<RecipesStackParamsList, 'SingleRecipe'>>()
    const { recipeId } = route.params

    const { data: recipeCategoriesData } = query.recipeCategories.all.useQuery()
    const {
        data: singleRecipeData,
        isPending: isSingleRecipeLoading,
        isError: isSingleRecipeError
    } = query.recipes.single.useQuery(recipeId.toString() || '')
    const { data: itemsData, isPending: isItemsLoading, isError: isItemsError } = query.items.all.useQuery()

    const { mutate: addItemToRecipe } = query.recipes.single.addItem.useMutation()

    if (isSingleRecipeLoading || isItemsLoading) {
        return <FullScreenLoader />
    }

    if (isSingleRecipeError || !singleRecipeData || isItemsError || !itemsData) {
        return (
            <View>
                <Text>Recipe error</Text>
            </View>
        )
    }

    const { name, id, items, instructions, recipe_category, image_url, prep_time, serves } = singleRecipeData

    const renderInstructions = () => {
        if (!isInstructionsShowing) {
            return null
        }

        return <Text style={styles.instructionsText}>{instructions || 'None set. Click the edit icon above to add some instructions.'}</Text>
    }

    const renderCurrentItems = () => {
        return (
            <View style={styles.currentItems}>
                <Text style={styles.currentItemsTitle}>Items</Text>
                <View>
                    {[...items]
                        .sort((a, b) => (a.name > b.name ? 1 : -1))
                        .map((item) => (
                            <EditRecipeItem key={item.id} item={item} recipeId={id} />
                        ))}
                </View>
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
                <MoreOptions />
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
            {/* TODO: do this once everything else is finished, as I need to get minio working locally again. */}
            {image_url ? (
                // <div className='relative mt-4 h-44 max-w-[450px]'>
                //     <img className='h-full w-full object-cover rounded-md' src={image_url || ''} alt={name} />
                //     <Dropdown
                //         dropdownClassName='!absolute top-3 right-3 h-8 w-8'
                //         menuButtonClassName='bg-white w-full h-full flex justify-center items-center rounded-full'
                //         menuButton={<EllipsisHorizontalIcon className='size-6' style={{ transform: 'scale(400%)' }} />}
                //         menuItems={[
                //             <Dropdown.MenuItem.Link key='1' to={`/recipes/edit/${id}/upload-image`}>
                //                 <CloudArrowUpIcon className='size-4 text-primary' />
                //                 Upload new
                //             </Dropdown.MenuItem.Link>,
                //             <Dropdown.MenuItem.Link key='2' to={`/recipes/edit/${id}/remove-image`}>
                //                 <TrashIcon className='size-4 text-primary' />
                //                 Remove
                //             </Dropdown.MenuItem.Link>
                //         ]}
                //     />
                // </div>
                <Text>Have image</Text>
            ) : (
                <Link style={styles.uploadImageLink} onPress={() => {}}>
                    Upload Image
                </Link>
            )}

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
                onAdd={(itemToAdd, categoryId, quantity, quantityUnitId) => {
                    const payload: AddItemToRecipePayload = { recipeId: id.toString(), itemName: itemToAdd, quantity }

                    if (categoryId && categoryId !== 'none') {
                        payload.categoryId = categoryId
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
        padding: 20,
        flex: 1,
        justifyContent: 'flex-start',
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
    uploadImageLink: {
        marginTop: 10
    },
    instructions: {
        marginTop: 16
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
    addItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    currentItems: {
        marginTop: 15
    },
    currentItemsTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 6
    }
})
