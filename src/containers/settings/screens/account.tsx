import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function AccountScreen() {
    return (
        <View style={styles.main}>
            <Text>Account</Text>
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
