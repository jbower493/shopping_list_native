import { Modal as RNModal, Pressable, View, StyleSheet } from 'react-native'
import { semantic } from '../../designTokens'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { _ModalHeader } from './_Header'

type ModalProps = {
    isOpen: boolean
    close: () => void
    children: React.JSX.Element
    title: string
    description?: string
}

export function _Modal({ isOpen, close, children, title, description }: ModalProps) {
    return (
        <RNModal animationType='slide' transparent={true} visible={isOpen} onRequestClose={close}>
            <View style={styles.container}>
                <View style={styles.overlay} />
                <View style={styles.modal}>
                    <_ModalHeader title={title} description={description} />
                    {children}
                    <Pressable style={styles.closeButton} onPress={close}>
                        <MaterialCommunityIcon name='close' size={24} color={semantic.colorTextDefault} />
                    </Pressable>
                </View>
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: semantic.paddingDefault
    },
    overlay: {
        backgroundColor: semantic.colorBackgroundInverse,
        position: 'absolute',
        inset: 0,
        opacity: 0.6
    },
    modal: {
        backgroundColor: semantic.colorBackgroundDefault,
        borderRadius: semantic.borderRadiusRounded,
        width: '100%',
        overflow: 'hidden'
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12
    }
})
