import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Form/Input'

export function RecipesScreen() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <View style={styles.main}>
            <Text style={styles.title}>Recipes</Text>
            <View style={styles.buttonContainer}>
                <Button title='Add New' onPress={() => {}} />
                <Input
                    containerStyle={styles.search}
                    placeholder='Search for a recipe'
                    value={searchTerm}
                    onChangeText={(text) => setSearchTerm(text)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 20,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    search: {
        width: 220
    }
})
