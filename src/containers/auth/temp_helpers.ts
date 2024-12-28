import { useContext } from 'react'
import { AuthContext } from './context'

export function useIsSignedIn() {
    const { isSignedIn } = useContext(AuthContext)
    return isSignedIn
}

export function useIsSignedOut() {
    const { isSignedIn } = useContext(AuthContext)
    return !isSignedIn
}
