import { useState } from 'react'
import { query } from '../../../queries'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { EditRecipeForm } from '../components/editRecipeForm'
import { Menu } from '../../../components/Menu'
import { MoreOptions } from '../components/moreOptions'

// TODO: get actual id from somewhere
const recipeId = '1'

export function SingleRecipeScreen() {
    const [isEditRecipeFormOpen, setIsEditRecipeFormOpen] = useState(false)
    const [isInstructionsShowing, setIsInstructionsShowing] = useState<boolean>(true)

    const { data: getRecipeCategoriesData } = query.recipeCategories.all.useQuery()
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
                {/* <Dropdown
                    dropdownClassName='h-8 w-8'
                    menuButtonClassName='!bg-primary !text-white w-full h-full flex justify-center items-center rounded-full'
                    menuButton={<EllipsisHorizontalIcon className='size-6' style={{ transform: 'scale(400%)' }} />}
                    menuItems={[
                        <Dropdown.MenuItem.Button key='1' onClick={() => navigate(`/recipes/edit/${id}/duplicate`)}>
                            <Square2StackIcon className='w-4 text-primary' />
                            Duplicate
                        </Dropdown.MenuItem.Button>,
                        <Dropdown.MenuItem.Button key='2' onClick={() => navigate(`/recipes/edit/${id}/share`)}>
                            <ArrowUpTrayIcon className='w-4 text-primary' />
                            Share
                        </Dropdown.MenuItem.Button>
                    ]}
                /> */}
                <MoreOptions />
            </View>
            {/* <div className='mt-2'>
                <div className='flex gap-4 items-center mt-3'>
                    <CategoryTag
                        key={id}
                        categoriesData={getRecipeCategoriesData || []}
                        categoryName={recipe_category?.name || 'Uncategorized'}
                        size='sm'
                    />
                    <div className='flex gap-1 items-center'>
                        <ClockIcon className='w-5 text-primary' />
                        <p className='text-secondary-500 text-sm'>{formatPrepTime(prep_time)}</p>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <UsersIcon className='w-5 text-primary' />
                        <p className='text-secondary-500 text-sm'>{serves || '?'}</p>
                    </div>
                </div>
            </div>
            {image_url ? (
                <div className='relative mt-4 h-44 max-w-[450px]'>
                    <img className='h-full w-full object-cover rounded-md' src={image_url || ''} alt={name} />
                    <Dropdown
                        dropdownClassName='!absolute top-3 right-3 h-8 w-8'
                        menuButtonClassName='bg-white w-full h-full flex justify-center items-center rounded-full'
                        menuButton={<EllipsisHorizontalIcon className='size-6' style={{ transform: 'scale(400%)' }} />}
                        menuItems={[
                            <Dropdown.MenuItem.Link key='1' to={`/recipes/edit/${id}/upload-image`}>
                                <CloudArrowUpIcon className='size-4 text-primary' />
                                Upload new
                            </Dropdown.MenuItem.Link>,
                            <Dropdown.MenuItem.Link key='2' to={`/recipes/edit/${id}/remove-image`}>
                                <TrashIcon className='size-4 text-primary' />
                                Remove
                            </Dropdown.MenuItem.Link>
                        ]}
                    />
                </div>
            ) : (
                <div className='mt-2'>
                    <Link to={`/recipes/edit/${id}/upload-image`}>Upload Image</Link>
                </div>
            )}

            <div className='mt-4'>
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

            <EditRecipeForm recipeId={recipeId} isOpen={isEditRecipeFormOpen} setIsOpen={setIsEditRecipeFormOpen} />
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
    }
})
