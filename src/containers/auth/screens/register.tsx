import { StyleSheet, Text, View } from 'react-native'

export function RegisterScreen() {
    return (
        <View style={styles.main}>
            <Text>Register Screen</Text>
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
