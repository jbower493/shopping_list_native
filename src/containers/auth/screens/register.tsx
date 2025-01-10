import { StyleSheet, Text, TextInput, View } from 'react-native'
import { semantic } from '../../../designTokens'
import { useState } from 'react'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'

export function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { mutate: register } = query.auth.register.useMutation()

    function handleRegister() {
        register(
            { email, password, name },
            {
                onSuccess: () => {
                    console.log('success')
                }
            }
        )
    }

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <Text style={styles.heading}>Register</Text>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} onChangeText={setName} value={name} />
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} onChangeText={setEmail} value={email} />
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} onChangeText={setPassword} value={password} />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.input} onChangeText={setConfirmPassword} value={confirmPassword} />
                <View style={styles.buttonView}>
                    <Button color={semantic.colorBackgroundPrimary} title='Register' onPress={handleRegister} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: 300,
        borderWidth: 1,
        borderColor: semantic.colorBorderPrimary,
        borderRadius: semantic.borderRadiusDefault,
        padding: 20
    },
    heading: {
        fontSize: 22,
        fontWeight: 600,
        textAlign: 'center'
    },
    label: {
        marginTop: 14
    },
    input: {
        height: 36,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 8
    },
    buttonView: {
        marginTop: 14
    }
})
