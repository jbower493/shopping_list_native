import React from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { Link } from '../../../components/Link'
import { useNavigation } from '@react-navigation/native'
import { component, semantic } from '../../../designTokens'
import { DeleteList } from '../components/deleteList'
import { NewList } from '../components/newList'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export function ListsScreen() {
    const navigation = useNavigation()

    const { data: listsData, isFetching: isListsFetching, isError: isListsError } = query.lists.all.useQuery()

    if (isListsFetching) {
        return <FullScreenLoader />
    }

    if (isListsError || !listsData) {
        return (
            <View>
                <Text>Lists error</Text>
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Lists</Text>
            <View style={styles.buttonContainer}>{<NewList />}</View>
            <View style={styles.bottomContainer}>
                <FlatList
                    data={listsData}
                    keyExtractor={(list) => list.id.toString()}
                    renderItem={({ item: list }) => (
                        <View style={styles.list} key={list.id}>
                            <Link onPress={() => navigation.navigate('SingleList', { listId: list.id })}>
                                <Text>{list.name}</Text>
                            </Link>
                            <View style={styles.actions}>
                                <Pressable onPress={() => navigation.navigate('Shop', { listId: list.id })}>
                                    <MaterialCommunityIcon name='cart-variant' size={22} color={semantic.colorTextPrimary} />
                                </Pressable>
                                <DeleteList listId={list.id} listName={list.name} />
                            </View>
                        </View>
                    )}
                />
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
    list: {
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
