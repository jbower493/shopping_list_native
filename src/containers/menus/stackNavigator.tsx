import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { MenusScreen } from './screens/menus'
import { SingleMenuScreen } from './screens/singleMenu'

export type MenusStackParamsList = {
    MenusHome: undefined
    SingleMenu: { menuId: number }
}

export const MenusStackNavigator = createNativeStackNavigator<MenusStackParamsList>({
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
        },
        SingleMenu: {
            screen: SingleMenuScreen,
            options: {
                headerShown: true,
                title: 'Single Menu'
            }
        }
    }
})
