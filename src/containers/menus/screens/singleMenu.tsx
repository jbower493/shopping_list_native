import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native'
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
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'

import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { ReactNode, useState } from 'react'

type Dropzone = { x: number; y: number; w: number; h: number } | null
type OnDrop = (finalX: number, finalY: number) => void

function DragableItem({ children, onDrop }: { children: ReactNode; onDrop: OnDrop }) {
    const isPressed = useSharedValue(false)
    const offset = useSharedValue({ x: 0, y: 0 })

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }, { scale: withSpring(isPressed.value ? 1.3 : 1) }]
        }
    })

    const start = useSharedValue({ x: 0, y: 0 })
    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true
        })
        .onUpdate((e) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y
            }
        })
        .onEnd((e) => {
            offset.value = {
                x: 0,
                y: 0
            }

            onDrop(e.absoluteX, e.absoluteY)
        })
        .onFinalize(() => {
            isPressed.value = false
        })
        .runOnJS(true)

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={animatedStyles}>{children}</Animated.View>
        </GestureDetector>
    )
}

function useDropzones() {
    const [dropzones, setDropzones] = useState<Record<string, Dropzone>>({})

    function registerDropzone(id: string, dropzone: Dropzone) {
        setDropzones((prev) => ({ ...prev, [id]: dropzone }))
    }

    return { registerDropzone, dropzones }
}

export function SingleMenuScreen() {
    const route = useRoute<RouteProp<MenusStackParamsList, 'SingleMenu'>>()
    const { menuId } = route.params

    const { dropzones, registerDropzone } = useDropzones()

    const { data: singleMenuData, isPending: isSingleMenuPending, isError: isSingleMenuError } = query.menus.single.useQuery(menuId.toString())
    const { data: recipesData, isFetching: isRecipesFetching, isError: isRecipesError } = query.recipes.all.useQuery()

    const { mutate: removeRecipeFromMenu } = query.menus.single.removeRecipe.useMutation()

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

    function onDrop(finalX: number, finalY: number) {
        const targetDropzoneId =
            Object.entries(dropzones).find(([, dropzone]) => {
                if (!dropzone) {
                    return
                }

                const { x: dzLeft, y: dzTop, w, h } = dropzone
                const dzRight = dzLeft + w
                const dzBottom = dzTop + h

                const isInside = finalX > dzLeft && finalX < dzRight && finalY > dzTop && finalY < dzBottom

                return isInside
            })?.[0] ?? null

        console.log(targetDropzoneId)
    }
    console.log(dropzones)
    function handleRegisterDropzone(e: LayoutChangeEvent, dropzoneId: string) {
        e.target.measureInWindow((x, y, w, h) => {
            registerDropzone(dropzoneId, { x, y, w, h })
        })
    }

    return (
        <GestureHandlerRootView style={styles.main}>
            <ScrollView>
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
                        <Text style={styles.noDayTitle}>No Day Assigned</Text>
                        {[...recipes]
                            .filter(
                                ({ day_of_week }) =>
                                    !getDayOptions()
                                        .map((dayOption) => dayOption.date)
                                        .includes(day_of_week.day || '')
                            )
                            .sort((a, b) => (a.name > b.name ? 1 : -1))
                            .map((recipe) => (
                                <View style={styles.menuRecipe} key={recipe.id}>
                                    <DragableItem onDrop={onDrop}>
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

                    <View style={styles.day} onLayout={(e) => handleRegisterDropzone(e, 'sat')}>
                        <Text style={styles.dayTitle}>Saturday</Text>
                    </View>

                    <View style={styles.day} onLayout={(e) => handleRegisterDropzone(e, 'sun')}>
                        <Text style={styles.dayTitle}>Sunday</Text>
                    </View>
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
        marginTop: 7,
        paddingLeft: 10
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: component.actions_gapDefault
    },
    day: {
        marginBottom: 25
    },
    noDayTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 5
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 5,
        color: semantic.colorTextPrimary
    }
})
