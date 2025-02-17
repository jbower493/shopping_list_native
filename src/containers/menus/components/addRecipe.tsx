import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormRow } from '../../../components/Form/FormRow'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { query } from '../../../queries'
import { Menu } from '../../../queries/menus/types'
import { Picker } from '../../../components/Form/Picker'
import { ComboBox } from '../../../components/Form/ComboBox'
import { getFilteredRecipesByCategory, getRecipeCategoryOptions } from '../../../utils/functions'
import { getDayOptions } from './days/utils'

type Inputs = {
    recipeCategoryId: string | undefined
    recipeName: string
    day: string
}

type AddRecipeProps = {
    menuId: Menu['id']
}

export function AddRecipe({ menuId }: AddRecipeProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: recipeCategoriesData, isFetching: isRecipeCategoriesFetching } = query.recipeCategories.all.useQuery()
    const { data: recipesData, isFetching: isRecipesFetching, isError: isRecipesError } = query.recipes.all.useQuery()

    const { mutate: addRecipesToMenu } = query.menus.single.addRecipes.useMutation()

    const allowedRecipeNames = recipesData?.map((recipe) => recipe.name) || []

    const schema = z.object({
        recipeCategoryId: z.string(),
        recipeName: z.string().refine((val) => allowedRecipeNames.includes(val), { message: 'Must be one of your existing recipes.' }),
        day: z.string()
    })

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            recipeCategoryId: 'ALL_CATEGORIES',
            recipeName: '',
            day: 'NO_DAY'
        }
    })

    const {
        handleSubmit,
        formState: { isValid }
    } = methods

    const selectedRecipeCategoryId = methods.watch('recipeCategoryId')

    const onSubmit: SubmitHandler<Inputs> = async ({ recipeName, day }) => {
        const recipeIdToAdd = recipesData?.find((recipe) => recipe.name === recipeName)?.id.toString() || ''

        setIsOpen(false)
        addRecipesToMenu({
            menuId: menuId.toString(),
            recipes: [
                {
                    id: recipeIdToAdd,
                    day: day === 'NO_DAY' ? null : day
                }
            ]
        })
    }

    return (
        <View>
            <Button onPress={() => setIsOpen(true)}>Add Recipe</Button>
            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                title='Add Recipe To Menu'
                description='Choose a recipe to add to this menu. Select a recipe category to show only the recipes from that category.'
            >
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body isLoading={isRecipesFetching || isRecipeCategoriesFetching} isError={isRecipesError}>
                            <FormRow>
                                <Picker.HookForm
                                    label='Recipe Category'
                                    name='recipeCategoryId'
                                    options={[
                                        { label: 'All categories', value: 'ALL_CATEGORIES' },
                                        ...getRecipeCategoryOptions(recipeCategoriesData)
                                    ]}
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
                            <Picker.HookForm
                                label='Day'
                                name='day'
                                options={[
                                    { label: 'No day', value: 'NO_DAY' },
                                    ...getDayOptions().map(({ day, date }) => ({
                                        label: day,
                                        value: date
                                    }))
                                ]}
                            />
                            <View style={{ height: 100 }} />
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Add Recipe
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
