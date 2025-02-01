import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/Form/Input'
import { FormRow } from '../../../components/Form/FormRow'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { query } from '../../../queries'
import { Picker } from '../../../components/Form/Picker'
import { getRecipeCategoryOptions } from '../../../utils/functions'
import { semantic } from '../../../designTokens'
import { flashMessage } from '../../../utils/flashMessage'
import { useNavigation } from '@react-navigation/native'

type Inputs = {
    name: string
    recipeCategoryId: string
    instructions: string
    prepTime: string
    serves: string
    newRecipeCategory: string
}

const schema = z.object({
    name: z.string().min(1, 'Required'),
    instructions: z.string(),
    recipeCategoryId: z.string(),
    prepTime: z.coerce.number(),
    serves: z.coerce.number(),
    newRecipeCategory: z.string()
})

export function NewRecipe() {
    const navigation = useNavigation()

    const [isOpen, setIsOpen] = useState(false)

    const { data: recipeCategoriesData, isPending: isRecipeCategoriesPending } = query.recipeCategories.all.useQuery()

    const { mutateAsync: createRecipe } = query.recipes.create.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            instructions: '',
            recipeCategoryId: 'none',
            newRecipeCategory: '',
            prepTime: '15',
            serves: '1'
        }
    })

    const recipeCategoryIdValue = methods.watch('recipeCategoryId')
    const newRecipeCategoryValue = methods.watch('newRecipeCategory')

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name, newRecipeCategory, recipeCategoryId, instructions, prepTime, serves }) => {
        await createRecipe(
            {
                name,
                newRecipeCategory: newRecipeCategory,
                recipe_category_id: recipeCategoryId === 'none' ? null : Number(recipeCategoryId),
                instructions,
                prep_time: Number(prepTime),
                serves: Number(serves)
            },
            {
                onSuccess: (res) => {
                    flashMessage({
                        message: res.message,
                        type: 'success'
                    })
                    navigation.navigate('SingleRecipe', { recipeId: res.data?.recipe_id })
                }
            }
        )
    }

    return (
        <View>
            <Button onPress={() => setIsOpen(true)}>Add New</Button>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='New Recipe'>
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body isLoading={isRecipeCategoriesPending}>
                            <View>
                                <FormRow>
                                    <Input.HookForm label='Name' name='name' />
                                </FormRow>
                                <FormRow>
                                    <Picker.HookForm
                                        label='Choose Existing Category'
                                        name='recipeCategoryId'
                                        options={getRecipeCategoryOptions(recipeCategoriesData)}
                                        isDisabled={!!newRecipeCategoryValue}
                                    />
                                </FormRow>
                                <FormRow>
                                    <Text style={styles.or}>OR</Text>
                                </FormRow>
                                <FormRow>
                                    <Input.HookForm
                                        label='Create New Category'
                                        name='newRecipeCategory'
                                        isDisabled={!!recipeCategoryIdValue && recipeCategoryIdValue !== 'none'}
                                    />
                                </FormRow>
                                <View style={styles.doubleFormRow}>
                                    <Input.HookForm
                                        style={styles.doubleFormRowInput}
                                        label='Prep Time (mins)'
                                        name='prepTime'
                                        keyboardType='numeric'
                                    />
                                    <Input.HookForm style={styles.doubleFormRowInput} label='Serves' name='serves' keyboardType='numeric' />
                                </View>
                                <FormRow>
                                    <Input.HookForm label='Instructions' name='instructions' isTextArea />
                                </FormRow>
                            </View>
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
    doubleFormRow: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10
    },
    doubleFormRowInput: {
        flex: 1
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    or: {
        color: semantic.colorTextPrimary
    }
})
