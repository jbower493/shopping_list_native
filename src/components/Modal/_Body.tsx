import { View, StyleSheet } from 'react-native'
import { modalPadding } from './consts'

type ModalBodyProps = {
    children: React.JSX.Element
}

export function _ModalBody({ children }: ModalBodyProps) {
    return <View style={styles.mainContent}>{children}</View>
}

const styles = StyleSheet.create({
    mainContent: {
        padding: modalPadding
    }
})
