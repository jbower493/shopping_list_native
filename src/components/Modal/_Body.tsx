import { View, StyleSheet, Text } from 'react-native'
import { modalPadding } from './consts'

type ModalBodyProps = {
    children: React.JSX.Element
    isLoading?: boolean
}

export function _ModalBody({ children, isLoading }: ModalBodyProps) {
    return <View style={styles.mainContent}>{isLoading ? <Text>Loading...</Text> : children}</View>
}

const styles = StyleSheet.create({
    mainContent: {
        padding: modalPadding
    }
})
