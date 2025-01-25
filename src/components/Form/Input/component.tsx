import React from 'react'
import {
    InputModeOptions,
    KeyboardTypeOptions,
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
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    containerStyle?: StyleProp<ViewStyle>
    isTextArea?: boolean
    style?: StyleProp<ViewStyle>
}

type TInputField = React.FC<InputFieldProps>

export const InputComponent: TInputField = ({
    label,
    placeholder,
    onChangeText,
    value,
    onBlur,
    inputMode,
    keyboardType,
    secureTextEntry,
    containerStyle,
    isTextArea,
    style
}) => {
    return (
        <View style={[containerStyle, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                style={[styles.input, isTextArea ? styles.textArea : null]}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                onBlur={onBlur}
                inputMode={inputMode}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                multiline={!!isTextArea}
                numberOfLines={isTextArea ? 4 : undefined}
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
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    }
})
