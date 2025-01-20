import React from 'react'
import { useController } from 'react-hook-form'
import { InputModeOptions, View } from 'react-native'
import { InputComponent } from './component'
import { ErrorMessage } from '../ErrorMessage'

type InputHookFormWrapperProps = {
    name: string
    label?: string
    placeholder?: string
    inputMode?: InputModeOptions
    secureTextEntry?: boolean
}

export function InputHookFormWrapper({ name, label, placeholder, inputMode, secureTextEntry }: InputHookFormWrapperProps) {
    const { field, fieldState } = useController({ name })

    return (
        <View>
            <InputComponent
                label={label}
                placeholder={placeholder}
                onChangeText={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
            />
            <ErrorMessage error={fieldState.isTouched && fieldState.error} />
        </View>
    )
}
