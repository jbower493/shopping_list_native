import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabsNavigator } from './tabsNavigator'
import { semantic } from '../designTokens'
import { LoginScreen } from '../containers/auth/screens/login'
import { RegisterScreen } from '../containers/auth/screens/register'
import { query } from '../queries'
import { useQueryClient } from '@tanstack/react-query'
import { QueryResponse } from '../queries/utils/types'
import { User, UserDataAdditionalUser } from '../queries/auth/types'

function useIsSignedIn() {
    const queryClient = useQueryClient()
    const userData = queryClient.getQueryData<
        QueryResponse<{
            user: User
            additional_user: UserDataAdditionalUser | null
        }>
    >(query.auth.user.queryKey)

    return !!userData
}

function useIsSignedOut() {
    const queryClient = useQueryClient()
    const userData = queryClient.getQueryData<
        QueryResponse<{
            user: User
            additional_user: UserDataAdditionalUser | null
        }>
    >(query.auth.user.queryKey)

    return !userData
}

export const RootStack = createNativeStackNavigator({
    groups: {
        LoggedIn: {
            if: useIsSignedIn,
            screens: {
                Home: {
                    screen: TabsNavigator,
                    options: {
                        headerShown: false
                    }
                }
            }
        },
        LoggedOut: {
            if: useIsSignedOut,
            screenOptions: {
                headerTintColor: semantic.colorTextPrimary
            },
            screens: {
                Login: LoginScreen,
                Register: RegisterScreen
            }
        }
    }
})
