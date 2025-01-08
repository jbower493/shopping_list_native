import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-navigation/elements'
import { query } from '../../../queries'

export function LoginScreen() {
    const navigation = useNavigation()

    const { mutate, status, error } = query.auth.login.useMutation()

    // console.log(status, error)

    return (
        <View style={styles.main}>
            <Text>Login Screen</Text>
            <Button onPress={() => mutate({ email: 'bob@bob.com', password: 'Password' })}>Sign In</Button>
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
