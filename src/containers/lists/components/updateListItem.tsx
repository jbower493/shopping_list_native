import { Pressable, StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { useState } from 'react'
import { Item } from '../../../queries/items/types'
import { query } from '../../../queries'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FormRow } from '../../../components/Form/FormRow'
import { Input } from '../../../components/Form/Input'
import { Picker } from '../../../components/Form/Picker'
import { List } from '../../../queries/lists/types'
import { UploadImage } from './uploadImage'
import { flashMessage } from '../../../utils/flashMessage'

type UpdateListItemQuantityProps = {
    listId: List['id']
    itemId: Item['id']
}

type Inputs = {
    quantity: string
    quantityUnitId: string
}

export function UpdateListItem({ listId, itemId }: UpdateListItemQuantityProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: quantityUnitsData, isFetching: isQuantityUnitsFetching, isError: isQuantityUnitsError } = query.quantityUnits.all.useQuery()
    const { data: singleListData, isFetching: isSingleListFetching, isError: isSingleListError } = query.lists.single.useQuery(listId.toString())
    const { mutateAsync: updateListItemQuantity } = query.lists.single.itemQuantity.useMutation()

    const foundListItem = singleListData?.items.find(({ id }) => id === Number(itemId))

    const methods = useForm<Inputs>({
        mode: 'onChange',
        defaultValues: {
            quantity: foundListItem?.item_quantity.quantity.toString() || '',
            quantityUnitId: foundListItem?.item_quantity.quantity_unit?.id.toString() || 'NO_UNIT'
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ quantity, quantityUnitId }) => {
        const quanityUnitIdToSend = quantityUnitId === 'NO_UNIT' ? null : Number(quantityUnitId)
        const attributes = { item_id: Number(itemId), quantity: Number(quantity), quantity_unit_id: quanityUnitIdToSend }

        await updateListItemQuantity(
            { listId: listId.toString(), attributes },
            {
                onSuccess: (res) => {
                    setIsOpen(false)
                    flashMessage({
                        type: 'success',
                        message: res.message
                    })
                }
            }
        )
    }

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Update List Item' description={foundListItem?.name}>
                <View>
                    <Modal.Body
                        isLoading={isQuantityUnitsFetching || isSingleListFetching}
                        isError={isSingleListError || isQuantityUnitsError || !singleListData || !quantityUnitsData}
                    >
                        <FormProvider {...methods}>
                            <UploadImage listItem={foundListItem} listId={listId} />
                            <FormRow>
                                <Input.HookForm label='Quantity' name='quantity' keyboardType='numeric' />
                            </FormRow>
                            <FormRow>
                                <Picker.HookForm
                                    label='Unit'
                                    name='quantityUnitId'
                                    options={[
                                        {
                                            label: 'no unit',
                                            value: 'NO_UNIT'
                                        },
                                        ...(quantityUnitsData?.map((quantityUnit) => ({
                                            label: quantityUnit.symbol,
                                            value: quantityUnit.id.toString(10)
                                        })) || [])
                                    ]}
                                />
                            </FormRow>
                        </FormProvider>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button onPress={handleSubmit(onSubmit)} isDisabled={!isValid} isLoading={isSubmitting}>
                                Update
                            </Button>
                        </View>
                    </Modal.Footer>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    }
})
