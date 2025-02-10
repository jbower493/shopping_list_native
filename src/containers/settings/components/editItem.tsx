import { Pressable, StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { useState } from 'react'
import { Item } from '../../../queries/items/types'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FormRow } from '../../../components/Form/FormRow'
import { Input } from '../../../components/Form/Input'
import { Picker } from '../../../components/Form/Picker'
import { flashMessage } from '../../../utils/flashMessage'
import * as z from 'zod'
import { query } from '../../../queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadItemImage } from './uploadItemImage'
import { getCategoryOptions } from '../../../utils/functions'

type EditItemProps = {
    item: Item
}

type Inputs = {
    name: string
    categoryId: string
}

const schema = z.object({
    name: z.string().min(1, 'Required'),
    categoryId: z.string()
})

export function EditItem({ item }: EditItemProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: categoriesData } = query.itemCategories.all.useQuery()

    const { mutateAsync: editItem } = query.items.single.update.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: item?.name,
            categoryId: item?.category?.id.toString() || 'none'
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name, categoryId }) => {
        await editItem(
            {
                itemId: item.id.toString(),
                attributes: {
                    name,
                    category_id: categoryId === 'none' ? null : Number(categoryId)
                }
            },
            {
                onSuccess: (res) => {
                    flashMessage({
                        type: 'success',
                        message: res.message
                    })
                    setIsOpen(false)
                }
            }
        )
    }

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Edit Item' description={item.name}>
                <View>
                    <Modal.Body>
                        <FormProvider {...methods}>
                            <UploadItemImage item={item} />
                            <FormRow>
                                <Input.HookForm label='Name' name='name' />
                            </FormRow>
                            <FormRow>
                                <Picker.HookForm label='Category' name='categoryId' options={getCategoryOptions(categoriesData)} />
                            </FormRow>
                        </FormProvider>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button onPress={handleSubmit(onSubmit)} isDisabled={!isValid} isLoading={isSubmitting}>
                                Save
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
