import React, { useEffect, useRef, useState } from 'react'
import { View, FlatList, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native'
import { Input } from './Input'
import { semantic } from '../../designTokens'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

type ComboBoxProps = {
    value: string
    setValue: (newValue: string) => void
    options: string[]
    placeholder?: string
}

export function ComboBox({ value, setValue, options, placeholder }: ComboBoxProps) {
    const inputRef = useRef<TextInput | null>(null)

    const [showDropdown, setShowDropdown] = useState(false)

    const filtered = value ? options.filter((item) => item.toLowerCase().includes(value.toLowerCase())) : options

    const handleSearch = (text: string) => {
        setValue(text)
    }

    const handleSelect = (item: string) => {
        setValue(item)
        setShowDropdown(false)
    }

    useEffect(() => {
        if (!value && showDropdown) {
            setShowDropdown(false)
        }
    }, [value])

    return (
        <View style={styles.container}>
            <Input
                inputRef={inputRef}
                style={{ width: 150 }}
                value={value}
                onChangeText={handleSearch}
                placeholder={placeholder}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
            />
            {value ? (
                <TouchableOpacity
                    onPress={() => {
                        handleSelect('')
                        inputRef.current?.blur()
                    }}
                    style={styles.clear}
                >
                    <MaterialCommunityIcon name='close-circle' size={20} color={semantic.colorTextInfo} />
                </TouchableOpacity>
            ) : null}
            {showDropdown && filtered.length > 0 && (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item}
                    style={styles.dropdown}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    dropdown: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: semantic.colorBackgroundDefault,
        borderWidth: 1,
        borderColor: semantic.colorBorderDefault,
        borderRadius: 5,
        maxHeight: 200,
        zIndex: 1
    },
    item: { padding: 10, borderBottomWidth: 1, borderBottomColor: semantic.colorBorderDefault },
    clear: {
        position: 'absolute',
        top: 8,
        right: 5
    }
})
