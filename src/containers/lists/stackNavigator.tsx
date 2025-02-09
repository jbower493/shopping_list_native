import { createNativeStackNavigator, NativeStackHeaderRightProps } from '@react-navigation/native-stack'
import { semantic } from '../../designTokens'
import { ListsScreen } from './screens/lists'
import { SingleListScreen } from './screens/singleList'
import { Button } from 'react-native'
import { query } from '../../queries'
import { deleteToken } from '../../queries/utils/tokenStorage'
import { useQueryClient } from '@tanstack/react-query'
import { ShopScreen } from './screens/shop'

function HeaderRightComponent(props: NativeStackHeaderRightProps) {
    const queryClient = useQueryClient()

    const { mutate: logout } = query.auth.logout.useMutation()

    return (
        // TODO: make this an icon, and move it somewhere proper
        <Button
            title='Logout'
            color={props.tintColor}
            onPress={() =>
                logout(undefined, {
                    onSuccess: async () => {
                        await deleteToken()
                        queryClient.resetQueries({ queryKey: query.auth.user.queryKey })
                    }
                })
            }
        />
    )
}

export type ListsStackParamsList = {
    ListsHome: undefined
    SingleList: { listId: number }
    Shop: { listId: number }
}

export const ListsStackNavigator = createNativeStackNavigator<ListsStackParamsList>({
    initialRouteName: 'ListsHome',
    screenOptions: {
        headerTintColor: semantic.colorTextPrimary
    },
    screens: {
        ListsHome: {
            screen: ListsScreen,
            options: {
                headerShown: true,
                title: 'Lists',
                // TODO: find a way to have this be a common thing in the header (if I keep it in the header). Currently it's only in the "Lists" header
                headerRight: HeaderRightComponent
            }
        },
        SingleList: {
            screen: SingleListScreen,
            options: {
                headerShown: true,
                title: 'Single List'
            }
        },
        Shop: {
            screen: ShopScreen,
            options: {
                headerShown: true,
                title: 'Shop'
            }
        }
    }
})
