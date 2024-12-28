import React, { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createStaticNavigation, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Button } from '@react-navigation/elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'

function LoginScreen() {
    const { signIn } = useContext(AuthContext)
    const navigation = useNavigation()

    return (
        <View style={styles.main}>
            <Text>Login Screen</Text>
            <Button onPress={() => signIn()}>Sign In</Button>
            <Button onPress={() => navigation.navigate('Register')}>Register</Button>
        </View>
    )
}

function RegisterScreen() {
    return (
        <View style={styles.main}>
            <Text>Register Screen</Text>
        </View>
    )
}

function LoadingScreen() {
    return (
        <View style={styles.loading}>
            <Text style={styles.whiteText}>Loading</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    whiteText: {
        color: 'white'
    }
})

function ListsScreen() {
    const navigation = useNavigation()

    return (
        <View style={styles.main}>
            <Text>Lists</Text>
            <Button onPress={() => navigation.navigate('SingleList')}>Single List</Button>
        </View>
    )
}

function SingleListScreen() {
    return (
        <View style={styles.main}>
            <Text>Single List</Text>
        </View>
    )
}

function RecipesScreen() {
    return (
        <View style={styles.main}>
            <Text>Recipes</Text>
        </View>
    )
}

function MenusScreen() {
    return (
        <View style={styles.main}>
            <Text>Menus</Text>
        </View>
    )
}

function ItemsScreen() {
    return (
        <View style={styles.main}>
            <Text>Items</Text>
        </View>
    )
}

const ListsStack = createNativeStackNavigator({
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

const MyTabs = createBottomTabNavigator({
    screens: {
        Lists: {
            screen: ListsStack,
            options: {
                headerShown: false,
                tabBarLabelStyle: {
                    color: 'red'
                },
                tabBarIcon: ({color, size}) => (
                    <Icon name="home" size={size} color={color} />
                )
            }
        },
        Recipes: {
            screen: RecipesScreen,
            options: {
                headerShown: false
            }
        },
        Menus: {
            screen: MenusScreen,
            options: {
                headerShown: false
            }
        },
        Items: {
            screen: ItemsScreen,
            options: {
                headerShown: false
            }
        }
    }
})

const AuthContext = createContext({
    signIn: () => {},
    signOut: () => {},
    isSignedIn: false
})

function useIsSignedIn() {
    const { isSignedIn } = useContext(AuthContext)
    return isSignedIn
}

function useIsSignedOut() {
    const { isSignedIn } = useContext(AuthContext)
    return !isSignedIn
}

const RootStack = createNativeStackNavigator({
    groups: {
        LoggedIn: {
            if: useIsSignedIn,
            screens: {
                Home: {
                    screen: MyTabs,
                    options: {
                        headerShown: false
                    }
                }
            }
        },
        LoggedOut: {
            if: useIsSignedOut,
            screens: {
                Login: LoginScreen,
                Register: RegisterScreen,
            }
        }
    }
})

const Navigation = createStaticNavigation(RootStack)

export function App() {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [])

    const authContext = {
        signIn: () => {
            setIsSignedIn(true)
        },
        signOut: () => {
            setIsSignedIn(false)
        },
        isSignedIn
    }

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <AuthContext.Provider value={authContext}>
            <Navigation />
        </AuthContext.Provider>
    )
}
