import { ReactNode } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { component, semantic } from '../../../../designTokens'

type DropTargetProps = {
    isOpen: boolean
    register: (e: LayoutChangeEvent) => void
    children: ReactNode
}

export function DropTarget({ isOpen, register, children }: DropTargetProps) {
    return (
        <View onLayout={register} style={[styles.target, isOpen ? styles.openTarget : null]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    target: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: semantic.borderRadiusDefault,
        borderColor: 'transparent',
        paddingVertical: 7,
        paddingLeft: 10,
        width: 300
    },
    openTarget: {
        borderColor: semantic.colorBorderPrimary,
        backgroundColor: component.DropTarget_colorBackground
    }
})
