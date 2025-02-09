import { useState } from 'react'
import { Item } from '../../../queries/items/types'
import { query } from '../../../queries'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Input } from '../../../components/Form/Input'
import { Picker } from '../../../components/Form/Picker'
import { ComboBox } from '../../../components/Form/ComboBox'
import { NewItemCategoryForm } from './newItemCategoryForm'

interface AddItemProps {
    onAdd: (itemToAdd: string, newCategory: string | null, existingCategoryId: string | null, quantity: number, quantityUnitId: number | null) => void
    itemsList: Item[]
}

export function AddItem({ onAdd, itemsList }: AddItemProps) {
    const [itemToAdd, setItemToAdd] = useState<string>('')
    const [quantityValueToAdd, setQuantityValueToAdd] = useState('1')
    const [quantityUnitToAdd, setQuantityUnitToAdd] = useState('NO_UNIT')
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

    const { data: quantityUnitsData } = query.quantityUnits.all.useQuery()

    const isNewItem = !itemsList.find(({ name }) => name === itemToAdd)

    function addItem(itemToAddLocal: string, newCategory: string | null, existingCategoryId: string | null) {
        const quanityUnitItToSend = quantityUnitToAdd === 'NO_UNIT' ? null : Number(quantityUnitToAdd)

        onAdd(itemToAddLocal, newCategory, existingCategoryId, Number(quantityValueToAdd), quanityUnitItToSend)
    }

    const quantityUnitOptions = [
        {
            label: 'no unit',
            value: 'NO_UNIT'
        },
        ...(quantityUnitsData?.map((quantityUnit) => ({
            label: quantityUnit.symbol,
            value: quantityUnit.id.toString(10)
        })) || [])
    ]

    return (
        <View style={styles.outerContainer}>
            <Text style={styles.title}>Add an item</Text>
            <View style={styles.innerContainer}>
                <Input style={styles.input} keyboardType='numeric' onChangeText={(text) => setQuantityValueToAdd(text)} value={quantityValueToAdd} />
                <Picker style={styles.picker} value={quantityUnitToAdd} setValue={setQuantityUnitToAdd} options={quantityUnitOptions} />
                <ComboBox value={itemToAdd} setValue={setItemToAdd} options={itemsList.map(({ name }) => name)} placeholder='Item name' />
                <View>
                    <Pressable
                        style={styles.plusButton}
                        onPress={() => {
                            if (isNewItem) {
                                setIsCategoryModalOpen(true)
                            } else {
                                addItem(itemToAdd, null, null)
                                setItemToAdd('')
                                setQuantityValueToAdd('1')
                                setQuantityUnitToAdd('NO_UNIT')
                            }
                        }}
                    >
                        <MaterialCommunityIcon name='plus' size={32} color={semantic.colorTextPrimary} />
                    </Pressable>
                </View>
            </View>
            <NewItemCategoryForm
                isOpen={isCategoryModalOpen}
                close={() => setIsCategoryModalOpen(false)}
                onSubmitFunc={(existingCategoryId, newCategory) => {
                    setIsCategoryModalOpen(false)
                    addItem(itemToAdd, newCategory, existingCategoryId)
                    setItemToAdd('')
                    setQuantityValueToAdd('1')
                    setQuantityUnitToAdd('NO_UNIT')
                }}
                itemName={itemToAdd}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 30
    },
    innerContainer: {
        marginTop: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    title: {
        fontSize: 16,
        fontWeight: 600
    },
    input: { width: 50 },
    picker: { width: 115 },
    plusButton: {
        marginLeft: 10
    }
})
