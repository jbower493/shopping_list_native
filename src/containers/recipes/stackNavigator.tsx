import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { RecipesScreen } from './screens/recipes'

export const RecipesStackNavigator = createNativeStackNavigator({
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        RecipesHome: {
            screen: RecipesScreen,
            options: {
                headerShown: true,
                title: 'Recipes'
            }
        }
    }
})