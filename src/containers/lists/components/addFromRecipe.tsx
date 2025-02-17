import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { List } from '../../../queries/lists/types'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getFilteredRecipesByCategory, getRecipeCategoryOptions } from '../../../utils/functions'
import { FormRow } from '../../../components/Form/FormRow'
import { Picker } from '../../../components/Form/Picker'
import { ComboBox } from '../../../components/Form/ComboBox'

type AddFromRecipeProps = {
    listId: List['id']
}

type Inputs = {
    recipeCategoryId: string | undefined
    recipeName: string
}

export function AddFromRecipe({ listId }: AddFromRecipeProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: recipesData, isFetching: isRecipesFetching, isError: isRecipesError } = query.recipes.all.useQuery()
    const { data: recipeCategoriesData, isFetching: isRecipeCategoriesFetching } = query.recipeCategories.all.useQuery()

    const { mutateAsync: addItemsFromRecipe } = query.lists.single.addFromRecipe.useMutation()

    const allowedRecipeNames = recipesData?.map((recipe) => recipe.name) || []

    const schema = z.object({
        recipeCategoryId: z.string(),
        recipeName: z.string().refine((val) => allowedRecipeNames.includes(val), { message: 'Must be one of your existing recipes.' })
    })

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            recipeCategoryId: 'ALL_CATEGORIES',
            recipeName: ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting },
        watch
    } = methods

    const selectedRecipeCategoryId = watch('recipeCategoryId')

    const onSubmit: SubmitHandler<Inputs> = async ({ recipeName }) => {
        const recipeIdToAdd = recipesData?.find((recipe) => recipe.name === recipeName)?.id.toString() || ''

        await addItemsFromRecipe(
            { listId: listId.toString(), recipeId: recipeIdToAdd },
            {
                onSuccess: (res) => {
                    flashMessage({
                        type: 'success',
                        message: res.message
                    })
                    setIsOpen(false)
                    methods.reset()
                }
            }
        )
    }

    return (
        <View>
            <Button onPress={() => setIsOpen(true)}>Add From Recipe</Button>
            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                title='Add Items From Recipe'
                description='Choose a recipe to add items from. This will add every item in your recipe to the current list.'
            >
                <FormProvider {...methods}>
                    <Modal.Body isLoading={isRecipesFetching || isRecipeCategoriesFetching} isError={isRecipesError}>
                        <FormRow>
                            <Picker.HookForm
                                label='Recipe Category'
                                name='recipeCategoryId'
                                options={[{ label: 'All categories', value: 'ALL_CATEGORIES' }, ...getRecipeCategoryOptions(recipeCategoriesData)]}
                            />
                        </FormRow>
                        <FormRow>
                            <ComboBox.HookForm
                                label='Recipe'
                                name='recipeName'
                                placeholder='Recipe name'
                                options={getFilteredRecipesByCategory(selectedRecipeCategoryId, recipesData || [])}
                            />
                        </FormRow>
                        <View style={{ height: 200 }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button onPress={handleSubmit(onSubmit)} isDisabled={!isValid} isLoading={isSubmitting}>
                                Add Items To List
                            </Button>
                        </View>
                    </Modal.Footer>
                </FormProvider>
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
