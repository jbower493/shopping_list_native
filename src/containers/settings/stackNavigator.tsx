import { semantic } from '../../designTokens'
import { ItemsScreen } from './screens/items'
import { RecipeCategoriesScreen } from './screens/recipeCategories'
import { CategoriesScreen } from './screens/categories'
import { AccountScreen } from './screens/account'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

export const SettingsTabNavigator = createBottomTabNavigator({
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary,
        tabBarStyle: {
            display: 'none'
        }
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
