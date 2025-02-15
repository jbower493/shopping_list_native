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
    new_password: string
    confirm_new_password: string
}

const schema = z
    .object({
        new_password: z.string().min(1, 'Required'),
        confirm_new_password: z.string().min(1, 'Required')
    })
    .refine((values) => values.new_password === values.confirm_new_password, {
        path: ['confirm_new_password'],
        message: 'Must match "Password" field'
    })

export function ChangePasswordForm() {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: changePassword } = query.account.changePassword.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            new_password: '',
            confirm_new_password: ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ new_password, confirm_new_password }) => {
        await changePassword(
            { new_password, confirm_new_password },
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
            <Button onPress={() => setIsOpen(true)}>Change Password</Button>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Change Password'>
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body>
                            <FormRow>
                                <Input.HookForm label='New Password' name='new_password' secureTextEntry />
                            </FormRow>
                            <FormRow>
                                <Input.HookForm label='Confirm New Password' name='confirm_new_password' secureTextEntry />
                            </FormRow>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button isLoading={isSubmitting} isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Change Password
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
