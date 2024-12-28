import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { ItemsScreen } from './screens/items'

export const ItemsStackNavigator = createNativeStackNavigator({
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        ItemsHome: {
            screen: ItemsScreen,
            options: {
                headerShown: true,
                title: 'Items'
            }
        }
    }
})