import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function RecipesScreen() {
    return (
        <View style={styles.main}>
            <Text>Recipes</Text>
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
