import React from 'react'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { ListsStackParamsList } from '../stackNavigator'
import { RouteProp, useRoute } from '@react-navigation/native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { AddItem } from '../../recipes/components/addItem'
import { AddItemToListPayload } from '../../../queries/lists/types'
import { Button } from '../../../components/Button'
import { getExistingCategories } from '../../../utils/functions'
import { CategoryTag } from '../../../components/CategoryTag'
import { EditListItem } from '../components/editListItem'

export function SingleListScreen() {
    const route = useRoute<RouteProp<ListsStackParamsList, 'SingleList'>>()
    const { listId } = route.params

    const { data: singleListData, isPending: isSingleListPending, isError: isSingleListError } = query.lists.single.useQuery(listId.toString())
    const { data: itemsData, isPending: isItemsPending, isError: isItemsError } = query.items.all.useQuery()
    const { mutate: addItemToList } = query.lists.single.addItem.useMutation()

    if (isSingleListPending || isItemsPending) {
        return <FullScreenLoader />
    }

    if (isSingleListError || !singleListData || isItemsError || !itemsData) {
        return (
            <View>
                <Text>List error</Text>
            </View>
        )
    }

    const { name, items } = singleListData

    function renderCurrentItems() {
        // Get a unique list of all the categories present in the list
        const categoriesOfExistingLists = getExistingCategories(items)

        const renderCategory = (categoryId: number, categoryName: string) => {
            let itemsList = items.filter(({ category }) => !category)

            if (categoryId !== -1) {
                itemsList = items.filter(({ category }) => category?.id === categoryId)
            }

            itemsList.sort((a, b) => (a.name > b.name ? 1 : -1))

            return (
                <View style={styles.category} key={categoryId}>
                    <View>
                        <CategoryTag categoriesData={categoriesOfExistingLists.filter(({ id }) => id !== -1)} categoryName={categoryName} />
                        {categoryId === -1 ? (
                            <Text style={styles.uncategorizedInstructions}>Go to the &quot;Items&quot; page to assign your items to categories</Text>
                        ) : null}
                    </View>
                    {itemsList.map((item) => (
                        <EditListItem key={item.id} item={item} listId={listId} />
                    ))}
                </View>
            )
        }

        return (
            <FlatList
                data={categoriesOfExistingLists}
                keyExtractor={(category) => category.id.toString()}
                renderItem={({ item: category }) => renderCategory(category.id, category.name)}
            />
        )
    }

    return (
        <View style={styles.main}>
            <View style={styles.topContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{name}</Text>
                    <Pressable style={styles.titleEditButton} onPress={() => {}}>
                        <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
                    </Pressable>
                </View>
                <Pressable onPress={() => {}}>
                    <MaterialCommunityIcon name='cart-variant' size={22} color={semantic.colorTextPrimary} />
                </Pressable>
            </View>

            <AddItem
                onAdd={(itemToAdd, newCategory, existingCategoryId, quantity, quantityUnitId) => {
                    const payload: AddItemToListPayload = { listId: listId.toString(), itemName: itemToAdd, quantity }

                    if (newCategory) {
                        payload.newCategory = newCategory
                    } else if (existingCategoryId && existingCategoryId !== 'none') {
                        payload.existingCategoryId = existingCategoryId
                    }

                    if (quantityUnitId) {
                        payload.quantityUnitId = quantityUnitId
                    }

                    addItemToList(payload)
                }}
                itemsList={itemsData || []}
            />

            <View style={styles.addFromContainer}>
                <Button onPress={() => {}}>Add From Recipe</Button>
                <Button onPress={() => {}}>Add From Menu</Button>
            </View>

            <View style={styles.currentItems}>
                <Text style={styles.currentItemsTitle}>Items</Text>
                {renderCurrentItems()}
            </View>
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
    addFromContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15
    },
    uncategorizedInstructions: {
        opacity: 0.6,
        marginTop: 4
    },
    category: {
        marginBottom: 22
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
