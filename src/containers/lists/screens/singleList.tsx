import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function SingleListScreen() {
    return (
        <View style={styles.main}>
            <Text>Single List</Text>
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
