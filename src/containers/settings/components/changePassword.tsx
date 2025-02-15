import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ChangePasswordForm } from './changePasswordForm'

export function ChangePassword() {
    return (
        <View style={styles.module}>
            <Text style={styles.title}>Change Password</Text>
            <View style={styles.buttonContainer}>
                <ChangePasswordForm />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    module: {
        marginBottom: 30
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15
    }
})
