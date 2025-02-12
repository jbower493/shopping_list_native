import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function AccountAccess() {
    return (
        <View style={styles.module}>
            <Text style={styles.title}>Account Access</Text>
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
    }
})
