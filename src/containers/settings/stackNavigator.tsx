import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { ItemsScreen } from './screens/items'
import { RecipeCategoriesScreen } from './screens/recipeCategories'
import { CategoriesScreen } from './screens/categories'
import { AccountScreen } from './screens/account'

export const SettingsStackNavigator = createNativeStackNavigator({
    initialRouteName: 'Account',
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        Account: {
            screen: AccountScreen,
            options: {
                headerShown: true,
                title: 'Account'
            }
        },
        Items: {
            screen: ItemsScreen,
            options: {
                headerShown: true,
                title: 'Items'
            }
        },
        Categories: {
            screen: CategoriesScreen,
            options: {
                headerShown: true,
                title: 'Item Categories'
            }
        },
        RecipeCategories: {
            screen: RecipeCategoriesScreen,
            options: {
                headerShown: true,
                title: 'Recipe Categories'
            }
        }
    }
})
