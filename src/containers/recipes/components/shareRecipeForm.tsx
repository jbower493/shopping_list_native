import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Recipe } from '../../../queries/recipes/types'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FormRow } from '../../../components/Form/FormRow'
import { Input } from '../../../components/Form/Input'

type ShareRecipeProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

type Inputs = {
    email: string
}

const schema = z.object({
    email: z.string().min(1, 'Required')
})

export function ShareRecipeForm({ recipeId, recipeName, isOpen, setIsOpen }: ShareRecipeProps) {
    const { mutateAsync: shareRecipe } = query.recipes.single.share.useMutation()

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
        await shareRecipe(
            { email, recipeId: recipeId },
            {
                onSuccess: (res) => {
                    flashMessage({
                        message: res.message,
                        type: 'success'
                    })
                    setIsOpen(false)
                }
            }
        )
    }

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Share Recipe' description={recipeName}>
            <FormProvider {...methods}>
                <Modal.Body>
                    <FormRow>
                        <Input.HookForm label='Email Address To Share With' name='email' />
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} isDisabled={!isValid}>
                            Share
                        </Button>
                    </View>
                </Modal.Footer>
            </FormProvider>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    }
})
