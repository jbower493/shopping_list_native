import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { Input } from '../../../components/Form/Input'
import { NewItem } from '../components/newItem'
import { component, semantic } from '../../../designTokens'
import { DeleteItem } from '../components/deleteItem'
import { EditItem } from '../components/editItem'
import { CategoryTag } from '../../../components/CategoryTag'

export function ItemsScreen() {
    const [search, setSearch] = useState('')

    const { data: itemsData, isFetching: isItemsFetching, isError: isItemsError } = query.items.all.useQuery()
    const { data: categoriesData, isFetching: isCategoriesFetching, isError: isCategoriesError } = query.itemCategories.all.useQuery()

    if (isItemsFetching || isCategoriesFetching) {
        return <FullScreenLoader />
    }

    if (isItemsError || !itemsData || isCategoriesError || !categoriesData) {
        return (
            <View>
                <Text>Items error</Text>
            </View>
        )
    }

    const filteredItems = itemsData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    const noItemsMessage = search
        ? 'No items matched your search.'
        : 'You don\'t currently have any items. Use the "Add New" button to create an item.'

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Items</Text>
            <View style={styles.buttonContainer}>
                <NewItem />
                <Input containerStyle={styles.search} placeholder='Search for an item' value={search} onChangeText={(text) => setSearch(text)} />
            </View>
            <View style={styles.bottomContainer}>
                {filteredItems.length > 0 ? (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(list) => list.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item} key={item.id}>
                                <View style={styles.itemNameAndCategory}>
                                    <Text>{item.name}</Text>
                                    <CategoryTag size='sm' categoriesData={categoriesData} categoryName={item.category?.name || 'Uncategorized'} />
                                </View>
                                <View style={styles.actions}>
                                    <EditItem item={item} />
                                    <DeleteItem itemId={item.id} itemName={item.name} />
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text>{noItemsMessage}</Text>
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
    search: {
        width: 220
    },
    bottomContainer: {
        flex: 1,
        marginTop: 20
    },
    itemNameAndCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    item: {
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
