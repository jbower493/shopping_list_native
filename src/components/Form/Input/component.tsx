import React from 'react'
import {
    InputModeOptions,
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputFocusEventData,
    View,
    ViewStyle
} from 'react-native'
import { semantic } from '../../../designTokens'

type InputFieldProps = {
    label?: string
    placeholder?: string
    onChangeText?: (text: string) => void
    value?: string
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
    inputMode?: InputModeOptions
    secureTextEntry?: boolean
    containerStyle?: StyleProp<ViewStyle>
}

type TInputField = React.FC<InputFieldProps>

export const InputComponent: TInputField = ({ label, placeholder, onChangeText, value, onBlur, inputMode, secureTextEntry, containerStyle }) => {
    return (
        <View style={containerStyle}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                onBlur={onBlur}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 6
    },
    input: {
        height: 36,
        borderWidth: 1,
        borderColor: semantic.colorBorderDefault,
        padding: 8
    }
})
