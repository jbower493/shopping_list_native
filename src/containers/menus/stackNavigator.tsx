import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { MenusScreen } from './screens/menus'

export const MenusStackNavigator = createNativeStackNavigator({
    initialRouteName: 'MenusHome',
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        MenusHome: {
            screen: MenusScreen,
            options: {
                headerShown: true,
                title: 'Menus'
            }
        }
    }
})
