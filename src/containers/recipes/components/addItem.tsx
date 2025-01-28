import { useState } from 'react'
import { Item } from '../../../queries/items/types'
import { query } from '../../../queries'
import { Pressable, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

interface AddItemProps {
    onAdd: (itemToAdd: string, categoryId: string | null, quantity: number, quantityUnitId: number | null) => void
    itemsList: Item[]
    className?: string
}

export function AddItem({ onAdd, itemsList, className }: AddItemProps) {
    const [itemToAdd, setItemToAdd] = useState<string>('')
    const [quantityValueToAdd, setQuantityValueToAdd] = useState('1')
    const [quantityUnitToAdd, setQuantityUnitToAdd] = useState('NO_UNIT')
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isBeingAdded, setIsBeingAdded] = useState(false)

    const { data: quantityUnitsData } = query.quantityUnits.all.useQuery()

    const isNewItem = !itemsList.find(({ name }) => name === itemToAdd)

    function addItem(itemToAddLocal: string, categoryId: string | null = null) {
        const quanityUnitItToSend = quantityUnitToAdd === 'NO_UNIT' ? null : Number(quantityUnitToAdd)

        onAdd(itemToAddLocal, categoryId, Number(quantityValueToAdd), quanityUnitItToSend)
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
        <View>
            <Text>Add an item</Text>
            <View>
                {/* <InputField
                    name='quanity'
                    onChange={(e) => setQuantityValueToAdd(e.target.value)}
                    value={quantityValueToAdd}
                    type='number'
                    className='px-1 w-12 sm:w-20'
                />
                <SelectField
                    name='quantityUnit'
                    onChange={(e) => setQuantityUnitToAdd(e.target.value)}
                    value={quantityUnitToAdd}
                    options={quantityUnitOptions}
                    className='px-[2px] w-[85px]'
                />
                <Combobox
                    value={itemToAdd}
                    setValue={setItemToAdd}
                    options={itemsList.map(({ name, id }) => ({ value: name, id }))}
                    placeholder='Item name'
                /> */}
                <View>
                    <Pressable
                        onPress={() => {
                            if (isNewItem) {
                                setIsCategoryModalOpen(true)
                            } else {
                                addItem(itemToAdd)
                                setItemToAdd('')
                                setQuantityValueToAdd('1')
                                setQuantityUnitToAdd('NO_UNIT')
                            }
                        }}
                    >
                        <MaterialCommunityIcon name='plus' size={22} color={semantic.colorTextPrimary} />
                    </Pressable>
                </View>
            </View>
            {/* <NewItemCategoryForm
                isOpen={isCategoryModalOpen}
                close={() => setIsCategoryModalOpen(false)}
                onSubmitFunc={(categoryId) => {
                    setIsCategoryModalOpen(false)
                    setIsBeingAdded(true)
                    setTimeout(() => {
                        setIsBeingAdded(false)
                        addItem(itemToAdd, categoryId)
                        setItemToAdd('')
                        setQuantityValueToAdd('1')
                        setQuantityUnitToAdd('NO_UNIT')
                    }, 200)
                }}
                itemName={itemToAdd}
            /> */}
        </View>
    )
}
