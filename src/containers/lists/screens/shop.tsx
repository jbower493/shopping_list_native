import { StyleSheet, Text, View } from 'react-native'
import { semantic } from '../../../designTokens'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ListsStackParamsList } from '../stackNavigator'

export function ShopScreen() {
    const route = useRoute<RouteProp<ListsStackParamsList, 'SingleList'>>()
    const { listId } = route.params

    return (
        <View style={styles.main}>
            <Text>Shop: {listId}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: semantic.paddingDefault,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
})
