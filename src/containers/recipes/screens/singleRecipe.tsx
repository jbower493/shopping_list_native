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

export function SingleRecipeScreen() {
    const [isEditRecipeFormOpen, setIsEditRecipeFormOpen] = useState(false)
    const [isInstructionsShowing, setIsInstructionsShowing] = useState<boolean>(true)

    const route = useRoute<RouteProp<RecipesStackParamsList, 'SingleRecipe'>>()
    const { recipeId } = route.params

    const { data: recipeCategoriesData } = query.recipeCategories.all.useQuery()
    const { data: singleRecipeData, isPending: isSingleRecipeLoading, isError: isSingleRecipeError } = query.recipes.single.useQuery(recipeId || '')
    // const { data: itemsData, isPending: isItemsLoading, isError: isItemsError } = useItemsQuery()

    // const { mutate: addItemToRecipe } = useAddItemToRecipeMutation()

    if (isSingleRecipeLoading /* || isItemsLoading*/) {
        return <FullScreenLoader />
    }

    if (isSingleRecipeError || !singleRecipeData /* || isItemsError || !itemsData*/) {
        return (
            <View>
                <Text>Recipe error</Text>
            </View>
        )
    }

    const { name, id, items, instructions, recipe_category, image_url, prep_time, serves } = singleRecipeData

    // const renderInstructions = () => {
    //     if (!isInstructionsShowing) {
    //         return ''
    //     }

    //     return (
    //         <pre className='text-secondary-500 whitespace-pre-wrap' style={{ fontFamily: 'inherit' }}>
    //             {instructions || 'None set. Click the edit icon above to add some instructions.'}
    //         </pre>
    //     )
    // }

    // const renderCurrentItems = () => {
    //     return (
    //         <>
    //             <h3>Items</h3>
    //             <ul className='mt-2 overflow-hidden pb-40'>
    //                 {[...items]
    //                     .sort((a, b) => (a.name > b.name ? 1 : -1))
    //                     .map((item, index) => (
    //                         <EditRecipeItem key={index} item={item} recipeId={id} />
    //                     ))}
    //             </ul>
    //         </>
    //     )
    // }

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

            {/*<div className='mt-4'>
                <div className='flex items-center mb-2'>
                    <h3>Instructions</h3>
                    <button
                        type='button'
                        onClick={() => setIsInstructionsShowing((prev) => !prev)}
                        className='ml-4 text-sky-500 hover:text-sky-600 hover:underline'
                    >
                        {isInstructionsShowing ? 'Hide' : 'Show'}
                    </button>
                    <button className='ml-4' type='button' onClick={() => navigate(`/recipes/edit/${id}/details`)}>
                        <PencilSquareIcon className='w-5 text-primary hover:text-primary-hover' />
                    </button>
                </div>
                {renderInstructions()}
            </div>
            <AddItem
                className='mt-6'
                onAdd={(itemToAdd, categoryId, quantity, quantityUnitId) => {
                    const payload: AddItemToRecipePayload = { recipeId: id.toString(), itemName: itemToAdd, quantity }

                    if (categoryId && categoryId !== 'none') payload.categoryId = categoryId
                    if (quantityUnitId) payload.quantityUnitId = quantityUnitId

                    addItemToRecipe(payload)
                }}
                itemsList={getItemsData}
            />
            <div className='mt-4'>{renderCurrentItems()}</div> */}

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
    }
})
