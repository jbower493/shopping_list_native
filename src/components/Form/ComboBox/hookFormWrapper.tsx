import { useController } from 'react-hook-form'
import { _ComboBox } from './component'
import { ErrorMessage } from '../ErrorMessage'
import { View } from 'react-native'

export interface ComboBoxHookFormWrapperProps {
    label?: string
    name: string
    options: string[]
    placeholder?: string
}

export const _ComboBoxHookFormWrapper: React.FC<ComboBoxHookFormWrapperProps> = ({ label, name, options, placeholder = 'Item name' }) => {
    const { field, fieldState } = useController({ name })

    return (
        <View>
            <_ComboBox
                label={label}
                value={field.value}
                setValue={field.onChange}
                options={options}
                placeholder={placeholder}
                onBlur={field.onBlur}
                isFullWidth
            />
            <ErrorMessage error={fieldState.isTouched && fieldState.error} />
        </View>
    )
}
