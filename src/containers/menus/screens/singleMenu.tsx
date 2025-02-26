import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { component, semantic } from '../../../designTokens'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MenusStackParamsList } from '../stackNavigator'
import { Text } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { MoreOptions } from '../components/moreOptions'
import { AddRecipe } from '../components/addRecipe'
import { getDayOptions } from '../components/days/utils'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDropzones } from '../components/dragNDrop/useDropzones'
import { DragableItem } from '../components/dragNDrop/dragableItem'
import { Recipe } from '../../../queries/recipes/types'
import { useState } from 'react'
import { DropTarget } from '../components/dragNDrop/dropTarget'

const dayOptions = getDayOptions()

export function SingleMenuScreen() {
    const route = useRoute<RouteProp<MenusStackParamsList, 'SingleMenu'>>()
    const { menuId } = route.params

    const { registerDropzone, getDropTarget } = useDropzones()
    const [isRecipeBeingDragged, setIsRecipeBeingDragged] = useState(false)
    const [TEMP_dropCount, TEMP_setDropCount] = useState(0)

    const { data: singleMenuData, isPending: isSingleMenuPending, isError: isSingleMenuError } = query.menus.single.useQuery(menuId.toString())
    const { data: recipesData, isFetching: isRecipesFetching, isError: isRecipesError } = query.recipes.all.useQuery()

    const { mutate: removeRecipeFromMenu } = query.menus.single.removeRecipe.useMutation()
    const { mutate: updateMenuRecipe } = query.menus.single.updateRecipe.useMutation()

    if (isSingleMenuPending || isRecipesFetching) {
        return <FullScreenLoader />
    }

    if (isSingleMenuError || !singleMenuData || isRecipesError || !recipesData) {
        return (
            <View>
                <Text>Menu error</Text>
            </View>
        )
    }

    const { name, id, recipes } = singleMenuData

    function handleRemoveRecipeFromMenu(recipeId: number) {
        removeRecipeFromMenu({ menuId: menuId.toString(), recipeId })
    }

    /**
     * Function to call when a draggable item is released. Returns boolean to indicate whether or not a valid drop target was hit
     */
    function onDrop(finalX: number, finalY: number, recipeId: Recipe['id']) {
        // This is a hack to get the dropzones to recalculate their layout after every drop. Not sure why they don't do that anyway
        TEMP_setDropCount((prev) => prev + 1)

        const dropTarget = getDropTarget(finalX, finalY)

        const recipe = recipes.find((recipeObj) => recipeObj.id === recipeId)
        const existingDayOfWeek = recipe?.day_of_week?.day ?? 'NO_DAY_ASSIGNED'

        // If there is no drop target, or it's the same as existing day, then don't do anything
        if (!dropTarget || dropTarget === existingDayOfWeek) {
            return false
        }

        // If there is a drop target but it's not one of the day options, then it must be the "no day assigned" drop target, so we'll send null to the backend.
        const date = dayOptions.find((option) => option.date === dropTarget)?.date || null

        updateMenuRecipe({
            menuId: id.toString(),
            recipeId: recipeId.toString(),
            attributes: {
                day: date
            }
        })

        return true
    }

    return (
        <GestureHandlerRootView style={styles.main}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.topContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{name}</Text>
                        <Pressable style={styles.titleEditButton} onPress={() => {}}>
                            <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
                        </Pressable>
                    </View>
                    <MoreOptions menuId={id} menuName={name} />
                </View>
                <View style={styles.buttonContainer}>{<AddRecipe menuId={id} />}</View>
                <Text style={styles.introText}>Drag and drop recipes to change the day.</Text>
                <View style={styles.mainView}>
                    <View style={styles.day}>
                        <DropTarget
                            key={`${TEMP_dropCount}_NO_DAY_ASSIGNED`}
                            isOpen={isRecipeBeingDragged}
                            register={(e) => registerDropzone(e, 'NO_DAY_ASSIGNED')}
                        >
                            <Text style={styles.noDayTitle}>No Day Assigned</Text>
                        </DropTarget>
                        {[...recipes]
                            .filter(({ day_of_week }) => !dayOptions.map((dayOption) => dayOption.date).includes(day_of_week.day || ''))
                            .sort((a, b) => (a.name > b.name ? 1 : -1))
                            .map((recipe) => (
                                <View style={styles.menuRecipe} key={recipe.id}>
                                    <DragableItem
                                        onDrop={(finalX, finalY) => onDrop(finalX, finalY, recipe.id)}
                                        setIsBeingDragged={(isBeingDragged) => setIsRecipeBeingDragged(isBeingDragged)}
                                    >
                                        <Text>{recipe.name}</Text>
                                    </DragableItem>
                                    <View style={styles.actions}>
                                        <Pressable onPress={() => handleRemoveRecipeFromMenu(recipe.id)}>
                                            <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                    </View>

                    {dayOptions.map((dayOption) => {
                        return (
                            <View key={dayOption.date} style={styles.day}>
                                <DropTarget
                                    key={`${TEMP_dropCount}_${dayOption.date}`}
                                    isOpen={isRecipeBeingDragged}
                                    register={(e) => registerDropzone(e, dayOption.date)}
                                >
                                    <Text style={styles.dayTitle}>{dayOption.day}</Text>
                                </DropTarget>
                                {[...recipes]
                                    .filter(({ day_of_week }) => day_of_week.day === dayOption.date)
                                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                                    .map((recipe) => (
                                        <View style={styles.menuRecipe} key={recipe.id}>
                                            <DragableItem
                                                onDrop={(finalX, finalY) => onDrop(finalX, finalY, recipe.id)}
                                                setIsBeingDragged={(isBeingDragged) => setIsRecipeBeingDragged(isBeingDragged)}
                                            >
                                                <Text>{recipe.name}</Text>
                                            </DragableItem>
                                            <View style={styles.actions}>
                                                <Pressable onPress={() => handleRemoveRecipeFromMenu(recipe.id)}>
                                                    <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
                                                </Pressable>
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </GestureHandlerRootView>
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
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    introText: {
        marginTop: 20
    },
    mainView: {
        marginTop: 25
    },
    menuRecipe: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 7,
        paddingLeft: 10
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: component.actions_gapDefault
    },
    day: {
        marginBottom: 8
    },
    noDayTitle: {
        fontSize: 18,
        fontWeight: 600
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 600,
        color: semantic.colorTextPrimary
    }
})
