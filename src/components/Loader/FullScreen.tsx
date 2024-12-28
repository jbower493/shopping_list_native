import { StyleSheet, Text, View } from 'react-native'

export function FullScreenLoader() {
    return (
        <View style={styles.fullScreenLoader}>
            <Text>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreenLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
