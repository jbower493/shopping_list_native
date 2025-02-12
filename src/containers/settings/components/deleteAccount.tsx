import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function DeleteAccount() {
    return (
        <View style={styles.module}>
            <Text style={styles.title}>Delete Account</Text>
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
    }
})
