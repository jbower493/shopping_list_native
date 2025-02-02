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
import { useNavigation } from '@react-navigation/native'

type DuplicateRecipeProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

type Inputs = {
    name: string
}

const schema = z.object({
    name: z.string().min(1, 'Required')
})

export function DuplicateRecipeForm({ recipeId, recipeName, isOpen, setIsOpen }: DuplicateRecipeProps) {
    const navigation = useNavigation()

    const { mutateAsync: duplicateRecipe } = query.recipes.single.duplicate.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: `${recipeName} (copy)`
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
        await duplicateRecipe(
            { recipeId: recipeId.toString(), attributes: { name } },
            {
                onSuccess(res) {
                    flashMessage({
                        message: res.message,
                        type: 'success'
                    })
                    setIsOpen(false)
                    navigation.navigate('SingleRecipe', { recipeId: res.data?.new_recipe_id })
                }
            }
        )
    }

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Duplicate Recipe' description={recipeName}>
            <FormProvider {...methods}>
                <Modal.Body>
                    <FormRow>
                        <Input.HookForm label='New Recipe Name' name='name' />
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} isDisabled={!isValid}>
                            Duplicate
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
