import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { ListsScreen } from './screens/lists'
import { SingleListScreen } from './screens/singleList'

export const ListsStackNavigator = createNativeStackNavigator({
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        ListsHome: {
            screen: ListsScreen,
            options: {
                headerShown: true,
                title: 'Lists'
            }
        },
        SingleList: {
            screen: SingleListScreen,
            options: {
                headerShown: true,
                title: 'Single List'
            }
        }
    }
})