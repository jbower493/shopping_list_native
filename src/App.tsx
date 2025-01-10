import React, { useEffect } from 'react'
import { createStaticNavigation } from '@react-navigation/native'
import { FullScreenLoader } from './components/Loader/FullScreen'
import { RootStack } from './navigation/rootStackNavigator'
import RNBootSplash from 'react-native-bootsplash'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queries/utils/queryClient'
import { FetchContext } from './queries/utils/fetchContext'
import { axiosInstance } from './queries/utils/axiosInstance'
import { query } from './queries'

const Navigation = createStaticNavigation(RootStack)

function TopLevelComponent() {
    const { isFetching: isUserFetching } = query.auth.user.useQuery()

    useEffect(() => {
        const init = async () => {
            // …do multiple sync or async tasks
        }

        init().finally(async () => {
            await RNBootSplash.hide({ fade: true })
        })
    }, [])

    if (isUserFetching) {
        return <FullScreenLoader />
    }

    return <Navigation />
}

export function App() {
    return (
        <FetchContext.Provider value={{ axiosInstance: axiosInstance }}>
            <QueryClientProvider client={queryClient}>
                <TopLevelComponent />
            </QueryClientProvider>
        </FetchContext.Provider>
    )
}
