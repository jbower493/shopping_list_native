import { StyleSheet, View } from 'react-native'

export function FormRow({ children }: { children: JSX.Element }) {
    return <View style={styles.row}>{children}</View>
}

const styles = StyleSheet.create({
    row: {
        marginBottom: 10
    }
})
