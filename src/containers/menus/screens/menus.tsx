import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { query } from '../../../queries'
import { FullScreenLoader } from '../../../components/Loader/FullScreen'
import { Link } from '../../../components/Link'
import { useNavigation } from '@react-navigation/native'
import { component, semantic } from '../../../designTokens'
import { DeleteMenu } from '../components/deleteMenu'
import { NewMenu } from '../components/newMenu'

export function MenusScreen() {
    const navigation = useNavigation()

    const { data: menusData, isFetching: isMenusFetching, isError: isMenusError } = query.menus.all.useQuery()

    if (isMenusFetching) {
        return <FullScreenLoader />
    }

    if (isMenusError || !menusData) {
        return (
            <View>
                <Text>Menus error</Text>
            </View>
        )
    }

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Menus</Text>
            <View style={styles.buttonContainer}>{<NewMenu />}</View>
            <View style={styles.bottomContainer}>
                <FlatList
                    data={menusData}
                    keyExtractor={(menu) => menu.id.toString()}
                    renderItem={({ item: menu }) => (
                        <View style={styles.list} key={menu.id}>
                            <Link onPress={() => navigation.navigate('SingleMenu', { menuId: menu.id })}>
                                <Text>{menu.name}</Text>
                            </Link>
                            <View style={styles.actions}>
                                <DeleteMenu menuId={menu.id} menuName={menu.name} />
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
