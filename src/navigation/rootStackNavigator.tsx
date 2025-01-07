import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TabsNavigator } from './tabsNavigator'
import { semantic } from '../designTokens'
import { LoginScreen } from '../containers/auth/screens/login'
import { RegisterScreen } from '../containers/auth/screens/register'
import { query } from '../queries'

function useIsSignedIn() {
    const { data: userData } = query.auth.user.useQuery()

    return !!userData
}

function useIsSignedOut() {
    const { data: userData } = query.auth.user.useQuery()

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
