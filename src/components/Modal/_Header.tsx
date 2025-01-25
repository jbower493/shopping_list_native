import { Text, View, StyleSheet } from 'react-native'
import { semantic } from '../../designTokens'
import { modalPadding } from './consts'

type ModalHeaderProps = {
    title: string
    description?: string
}

export function _ModalHeader({ title, description }: ModalHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomColor: semantic.colorBorderPrimary,
        borderBottomWidth: 1,
        padding: modalPadding
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    description: {
        marginTop: 6
    }
})
