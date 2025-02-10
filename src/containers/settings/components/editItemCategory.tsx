import { Pressable, StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FormRow } from '../../../components/Form/FormRow'
import { Input } from '../../../components/Form/Input'
import { flashMessage } from '../../../utils/flashMessage'
import * as z from 'zod'
import { query } from '../../../queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '../../../queries/categories/types'

type EditItemCategoryProps = {
    category: Category
}

type Inputs = {
    name: string
}

const schema = z.object({
    name: z.string().min(1, 'Required')
})

export function EditItemCategory({ category }: EditItemCategoryProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: editCategory } = query.itemCategories.single.update.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: category.name
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
        await editCategory(
            {
                categoryId: category.id.toString(),
                attributes: {
                    name
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
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Edit Category'>
                <View>
                    <Modal.Body>
                        <FormProvider {...methods}>
                            <FormRow>
                                <Input.HookForm label='Name' name='name' />
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
