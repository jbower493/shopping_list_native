import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { component, semantic } from '../../../designTokens'
import { EditItemCategory } from '../components/editItemCategory'
import { DeleteItemCategory } from '../components/deleteItemCategory'
import { NewItemCategory } from '../components/newItemCategory'

export function CategoriesScreen() {
    const { data: categoriesData, isFetching: isCategoriesFetching, isError: isCategoriesError } = query.itemCategories.all.useQuery()

    if (isCategoriesFetching) {
        return <FullScreenLoader />
    }

    if (isCategoriesError || !categoriesData) {
        return (
            <View>
                <Text>Categories error</Text>
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Categories</Text>
            <View style={styles.buttonContainer}>
                <NewItemCategory />
            </View>
            <View style={styles.bottomContainer}>
                {categoriesData.length > 0 ? (
                    <FlatList
                        data={categoriesData}
                        keyExtractor={(list) => list.id.toString()}
                        renderItem={({ item: category }) => (
                            <View style={styles.category} key={category.id}>
                                <Text>{category.name}</Text>
                                <View style={styles.actions}>
                                    <EditItemCategory category={category} />
                                    <DeleteItemCategory categoryId={category.id} categoryName={category.name} />
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text>No categories to display.</Text>
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
    bottomContainer: {
        flex: 1,
        marginTop: 20
    },
    category: {
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
