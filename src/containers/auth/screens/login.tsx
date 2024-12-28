import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { AuthContext } from '../context'

export function LoginScreen() {
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

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
