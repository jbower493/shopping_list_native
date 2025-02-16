import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DeleteAccountForm } from './deleteAccountForm'

export function DeleteAccount() {
    return (
        <View style={styles.module}>
            <Text style={styles.title}>Delete Account</Text>
            <Text style={styles.text}>
                After clicking the &quot;Delete Account&quot; button, you will be asked to type in your email address in order to confirm account
                deletion.
            </Text>
            <View style={styles.buttonContainer}>
                <DeleteAccountForm />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    module: {
        marginBottom: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    text: {
        marginTop: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15
    }
})
