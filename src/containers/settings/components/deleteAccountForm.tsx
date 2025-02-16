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
    confirm_email: string
}

export function DeleteAccountForm() {
    const [isOpen, setIsOpen] = useState(false)

    const { data: userData } = query.auth.user.useQuery()

    const { mutateAsync: deleteAccount } = query.account.deleteAccount.useMutation()

    const schema = z
        .object({
            confirm_email: z.string().min(1, 'Required')
        })
        .refine((values) => values.confirm_email === userData?.user.email, {
            path: ['confirm_email'],
            message: 'Must match account email address'
        })

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            confirm_email: ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async () => {
        await deleteAccount(
            { userId: userData?.user.id?.toString() || '' },
            {
                onSuccess: (res) => {
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
            <Button onPress={() => setIsOpen(true)}>Delete Account</Button>
            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                title='Delete Account'
                description='Please type the email address associated with the account to confirm you would like to delete the account.'
            >
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body>
                            <FormRow>
                                <Input.HookForm label='Account Email Address' name='confirm_email' />
                            </FormRow>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button color='error' isLoading={isSubmitting} isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Delete Account
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
