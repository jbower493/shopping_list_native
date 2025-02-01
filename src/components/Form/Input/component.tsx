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
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
    inputMode?: InputModeOptions
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    containerStyle?: StyleProp<ViewStyle>
    isTextArea?: boolean
    style?: StyleProp<ViewStyle>
    inputRef?: React.LegacyRef<TextInput>
    isDisabled?: boolean
}

type TInputField = React.FC<InputFieldProps>

export const InputComponent: TInputField = ({
    label,
    placeholder,
    onChangeText,
    value,
    onFocus,
    onBlur,
    inputMode,
    keyboardType,
    secureTextEntry,
    containerStyle,
    isTextArea,
    style,
    inputRef,
    isDisabled
}) => {
    return (
        <View style={[containerStyle, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                ref={inputRef}
                style={[styles.input, isTextArea ? styles.textArea : null, isDisabled ? styles.disabledInput : null]}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                inputMode={inputMode}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                multiline={!!isTextArea}
                numberOfLines={isTextArea ? 4 : undefined}
                editable={!isDisabled}
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
    disabledInput: {
        backgroundColor: semantic.colorBackgroundSecondary
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    }
})
