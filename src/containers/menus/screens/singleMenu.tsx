import { StyleSheet, View } from 'react-native'
import { semantic } from '../../../designTokens'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MenusStackParamsList } from '../stackNavigator'
import { Text } from 'react-native'

export function SingleMenuScreen() {
    const navigation = useNavigation()

    const route = useRoute<RouteProp<MenusStackParamsList, 'SingleMenu'>>()
    const { menuId } = route.params

    return (
        <View style={styles.main}>
            <Text>Single Menu</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: semantic.paddingDefault,
        justifyContent: 'flex-start',
        flex: 1,
        alignItems: 'flex-start'
    }
})
