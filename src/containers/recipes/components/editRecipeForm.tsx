import { StyleSheet, Text, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import * as z from 'zod'
import { query } from '../../../queries'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashMessage } from '../../../utils/flashMessage'
import { FormRow } from '../../../components/Form/FormRow'
import { Input } from '../../../components/Form/Input'
import { Picker } from '../../../components/Form/Picker'
import { getRecipeCategoryOptions } from '../../../utils/functions'
import { semantic } from '../../../designTokens'

type EditRecipeFormProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    recipeId: string
}

type Inputs = {
    name: string
    instructions?: string
    recipeCategoryId: string
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

export function EditRecipeForm({ recipeId, isOpen, setIsOpen }: EditRecipeFormProps) {
    const { data: getRecipeCategoriesData } = query.recipeCategories.all.useQuery()
    const { data: getSingleRecipeData } = query.recipes.single.useQuery(recipeId)

    const { mutateAsync: editRecipe } = query.recipes.single.update.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: getSingleRecipeData?.name,
            instructions: getSingleRecipeData?.instructions || '',
            recipeCategoryId: getSingleRecipeData?.recipe_category?.id.toString() || 'none',
            newRecipeCategory: '',
            prepTime: getSingleRecipeData?.prep_time?.toString() || '15',
            serves: getSingleRecipeData?.serves?.toString() || '1'
        }
    })

    const newRecipeCategoryValue = methods.watch('newRecipeCategory')

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name, instructions, newRecipeCategory, recipeCategoryId, prepTime, serves }) => {
        await editRecipe(
            {
                recipeId: recipeId || '',
                attributes: {
                    name,
                    instructions,
                    recipe_category_id: recipeCategoryId === 'none' ? null : Number(recipeCategoryId),
                    prep_time: Number(prepTime),
                    serves: Number(serves)
                },
                newRecipeCategory: newRecipeCategory
            },
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
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Edit Recipe'>
            <FormProvider {...methods}>
                <Modal.Body>
                    <FormRow>
                        <Input.HookForm label='Name' name='name' />
                    </FormRow>
                    <FormRow>
                        <Picker.HookForm
                            label='Choose Existing Category'
                            name='recipeCategoryId'
                            options={getRecipeCategoryOptions(getRecipeCategoriesData)}
                            isDisabled={!!newRecipeCategoryValue}
                        />
                    </FormRow>
                    <FormRow>
                        <Text style={styles.or}>OR</Text>
                    </FormRow>
                    <FormRow>
                        <Input.HookForm label='Create New Category' name='newRecipeCategory' />
                    </FormRow>
                    <View style={styles.doubleFormRow}>
                        <Input.HookForm style={styles.doubleFormRowInput} label='Prep Time (mins)' name='prepTime' keyboardType='numeric' />
                        <Input.HookForm style={styles.doubleFormRowInput} label='Serves' name='serves' keyboardType='numeric' />
                    </View>
                    <FormRow>
                        <Input.HookForm label='Instructions' name='instructions' isTextArea />
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} isDisabled={!isValid}>
                            Save
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
    },
    doubleFormRow: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10
    },
    doubleFormRowInput: {
        flex: 1
    },
    or: {
        color: semantic.colorTextPrimary
    }
})
