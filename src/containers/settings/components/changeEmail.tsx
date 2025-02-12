import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { semantic } from '../../../designTokens'
import { query } from '../../../queries'
import { ChangeEmailForm } from './changeEmailForm'

export function ChangeEmail() {
    const { data: userData } = query.auth.user.useQuery()

    return (
        <View style={styles.module}>
            <Text style={styles.title}>Account Email Address</Text>
            <Text>
                Current email: <Text style={styles.current}>{userData?.user.email}</Text>
            </Text>
            <View style={styles.buttonContainer}>
                <ChangeEmailForm />
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
        fontWeight: 600,
        marginBottom: 10
    },
    current: {
        color: semantic.colorTextPrimary
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15
    }
})
