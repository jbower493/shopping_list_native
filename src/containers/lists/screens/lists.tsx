import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button } from '@react-navigation/elements'

export function ListsScreen() {
    const navigation = useNavigation()

    return (
        <View style={styles.main}>
            <Text>Lists</Text>
            <Button onPress={() => navigation.navigate('SingleList')}>Single List</Button>
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
