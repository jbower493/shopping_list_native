import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native'
import { component, semantic } from '../designTokens'
import React from 'react'

type ButtonProps = {
    children: React.JSX.Element | string
    color?: 'primary' | 'secondary' | 'error'
    onPress?: ((event: GestureResponderEvent) => void) | undefined
    isDisabled?: boolean
    isLoading?: boolean
}

export function Button({ color = 'primary', children, onPress, isDisabled, isLoading }: ButtonProps) {
    function getBackgroundColor() {
        if (isDisabled || isLoading) {
            return component.Button_colorBackgroundDisabled
        }

        switch (color) {
            case 'error':
                return semantic.colorBackgroundError
            case 'secondary':
                return semantic.colorBackgroundSecondary
            case 'primary':
            default:
                return semantic.colorBackgroundPrimary
        }
    }

    function getTextColor() {
        if (color === 'secondary') {
            return semantic.colorTextDefault
        }

        return semantic.colorTextInverse
    }

    const backgroundColor = getBackgroundColor()
    const textColor = getTextColor()

    return (
        <Pressable style={[styles.button, { backgroundColor: backgroundColor }]} onPress={onPress} disabled={isDisabled || isLoading}>
            {(function () {
                if (isLoading) {
                    return <Text style={[styles.text, { color: textColor }]}>Loading...</Text>
                }

                return typeof children === 'string' ? <Text style={[styles.text, { color: textColor }]}>{children}</Text> : children
            })()}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 36,
        borderRadius: semantic.borderRadiusDefault,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    text: {
        textAlign: 'center',
        fontWeight: 500
    }
})
