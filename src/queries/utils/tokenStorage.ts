import * as Keychain from 'react-native-keychain'

export async function storeToken(token: string) {
    try {
        await Keychain.setGenericPassword('token', token)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function retrieveToken() {
    try {
        const retrieved = await Keychain.getGenericPassword()

        if (retrieved) {
            return retrieved.password
        } else {
            return null
        }
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function deleteToken() {
    try {
        await Keychain.resetGenericPassword()
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}
