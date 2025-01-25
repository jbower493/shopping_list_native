import { View, StyleSheet } from 'react-native'
import { modalPadding } from './consts'
import { component } from '../../designTokens'

type ModalFooterProps = {
    children: React.JSX.Element
}

export function _ModalFooter({ children }: ModalFooterProps) {
    return <View style={styles.footer}>{children}</View>
}

const styles = StyleSheet.create({
    footer: {
        padding: modalPadding,
        backgroundColor: component.ModalFooter_colorBackground
    }
})
