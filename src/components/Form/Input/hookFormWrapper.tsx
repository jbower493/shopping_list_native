import React from 'react'
import { useController } from 'react-hook-form'
import { InputModeOptions, KeyboardTypeOptions, StyleProp, View, ViewStyle } from 'react-native'
import { InputComponent } from './component'
import { ErrorMessage } from '../ErrorMessage'

type InputHookFormWrapperProps = {
    name: string
    label?: string
    placeholder?: string
    inputMode?: InputModeOptions
    keyboardType?: KeyboardTypeOptions
    secureTextEntry?: boolean
    isTextArea?: boolean
    style?: StyleProp<ViewStyle>
    isDisabled?: boolean
}

export function InputHookFormWrapper({
    name,
    label,
    placeholder,
    inputMode,
    keyboardType,
    secureTextEntry,
    isTextArea,
    style,
    isDisabled
}: InputHookFormWrapperProps) {
    const { field, fieldState } = useController({ name })

    return (
        <View style={style}>
            <InputComponent
                label={label}
                placeholder={placeholder}
                onChangeText={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                inputMode={inputMode}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                isTextArea={isTextArea}
                isDisabled={isDisabled}
            />
            <ErrorMessage error={fieldState.isTouched && fieldState.error} />
        </View>
    )
}
