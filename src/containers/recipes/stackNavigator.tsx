import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { RecipesScreen } from './screens/recipes'
import { SingleRecipeScreen } from './screens/singleRecipe'

export type RecipesStackParamsList = {
    RecipesHome: undefined
    SingleRecipe: { recipeId: number }
}

export const RecipesStackNavigator = createNativeStackNavigator<RecipesStackParamsList>({
    initialRouteName: 'RecipesHome',
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
        },
        SingleRecipe: {
            screen: SingleRecipeScreen,
            options: {
                headerShown: true,
                title: 'Single Recipe'
            }
        }
    }
})
