import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'

type PickerProps = {
    label?: string
    options: {
        label: string
        value: string
    }[]
}

export function _Picker({ label, options }: PickerProps) {
    const [selectedLanguage, setSelectedLanguage] = useState()

    return (
        <Picker selectedValue={selectedLanguage} onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}>
            {options.map((option) => {
                return <Picker.Item key={option.value} label={option.label} value={option.value} />
            })}
        </Picker>
    )
}
