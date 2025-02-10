import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/Form/Input'
import { FormRow } from '../../../components/Form/FormRow'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'

type Inputs = {
    name: string
}

const schema = z.object({
    name: z.string().min(1, 'Required')
})

export function NewItemCategory() {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: createCategory } = query.itemCategories.create.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
        await createCategory(
            { name },
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
            <Button onPress={() => setIsOpen(true)}>Add New</Button>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='New Category'>
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body>
                            <FormRow>
                                <Input.HookForm label='Name' name='name' />
                            </FormRow>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button isLoading={isSubmitting} isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Create
                                </Button>
                            </View>
                        </Modal.Footer>
                    </FormProvider>
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
