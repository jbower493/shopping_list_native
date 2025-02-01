import { Picker } from '@react-native-picker/picker'
import { NativeSyntheticEvent, StyleProp, StyleSheet, TargetedEvent, Text, View, ViewStyle } from 'react-native'
import { semantic } from '../../../designTokens'

type PickerProps = {
    label?: string
    value: string
    setValue: (newValue: string) => void
    options: {
        label: string
        value: string
    }[]
    onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void
    style?: StyleProp<ViewStyle>
    isDisabled?: boolean
}

export function _Picker({ label, value, setValue, options, onBlur, style, isDisabled }: PickerProps) {
    return (
        <View style={style}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.pickerContainer, isDisabled ? styles.disabledPicker : null]}>
                <Picker selectedValue={value} onValueChange={(itemValue) => setValue(itemValue)} onBlur={onBlur} enabled={!isDisabled}>
                    {options.map((option) => {
                        return <Picker.Item key={option.value} label={option.label} value={option.value} />
                    })}
                </Picker>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 6
    },
    pickerContainer: {
        height: 36,
        borderWidth: 1,
        borderColor: semantic.colorBorderDefault,
        borderRadius: semantic.borderRadiusDefault,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    picker: {
        flex: 1,
        color: semantic.colorTextDefault
    },
    disabledPicker: {
        backgroundColor: semantic.colorBackgroundSecondary
    }
})
