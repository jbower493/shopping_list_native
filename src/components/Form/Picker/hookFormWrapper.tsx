import { useController } from 'react-hook-form'
import { _Picker } from './component'
import { ErrorMessage } from '../ErrorMessage'
import { View } from 'react-native'

export interface PickerHookFormWrapperProps {
    label?: string
    name: string
    options: {
        label: string
        value: string
    }[]
}

export const _PickerHookFormWrapper: React.FC<PickerHookFormWrapperProps> = ({ label, name, options }) => {
    const { field, fieldState } = useController({ name })

    return (
        <View>
            <_Picker label={label} value={field.value} setValue={field.onChange} options={options} />
            <ErrorMessage error={fieldState.isTouched && fieldState.error} />
        </View>
    )
}
