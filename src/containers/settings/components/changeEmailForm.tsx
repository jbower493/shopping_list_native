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
    email: string
}

const schema = z.object({
    email: z.string().min(1, 'Required')
})

export function ChangeEmailForm() {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: changeEmail } = query.account.changeEmail.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            email: ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
        await changeEmail(
            { new_email: email },
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
            <Button onPress={() => setIsOpen(true)}>Change Email</Button>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Change Email Address'>
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body>
                            <FormRow>
                                <Input.HookForm label='New Email Address' name='email' />
                            </FormRow>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button isLoading={isSubmitting} isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Change Email
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
