import React, { useEffect, useState } from 'react'
import { createStaticNavigation } from '@react-navigation/native'
import { FullScreenLoader } from './components/Loader/FullScreen'
import { RootStack } from './navigation/rootStackNavigator'
import { AuthContext } from './containers/auth/context'
import RNBootSplash from 'react-native-bootsplash'

const Navigation = createStaticNavigation(RootStack)

export function App() {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            // …do multiple sync or async tasks
        }

        init().finally(async () => {
            await RNBootSplash.hide({ fade: true })
        })
    }, [])

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
        return <FullScreenLoader />
    }

    return (
        <AuthContext.Provider value={authContext}>
            <Navigation />
        </AuthContext.Provider>
    )
}
