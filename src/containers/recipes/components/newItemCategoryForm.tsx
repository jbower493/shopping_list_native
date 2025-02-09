import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { query } from '../../../queries'
import { getCategoryOptions } from '../../../utils/functions'
import { Modal } from '../../../components/Modal'
import { FormRow } from '../../../components/Form/FormRow'
import { Picker } from '../../../components/Form/Picker'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Form/Input'
import { semantic } from '../../../designTokens'

type Inputs = {
    categoryId: string
    newCategory: string
}

interface NewItemCategoryFormProps {
    onSubmitFunc: (existingCategoryId: string | null, newCategory: string | null) => void
    isOpen: boolean
    close: () => void
    itemName: string
}

export function NewItemCategoryForm({ onSubmitFunc, isOpen, close, itemName }: NewItemCategoryFormProps) {
    const { data: categoriesData, isFetching: isCategoriesFetching, isError: isCategoriesError } = query.itemCategories.all.useQuery()

    const methods = useForm<Inputs>({
        mode: 'all',
        defaultValues: {
            categoryId: 'none',
            newCategory: ''
        }
    })

    const categoryIdValue = methods.watch('categoryId')
    const newCategoryValue = methods.watch('newCategory')

    const onSubmit: SubmitHandler<Inputs> = async ({ categoryId, newCategory }) => {
        onSubmitFunc(categoryId || null, newCategory || null)
        methods.reset()
    }

    const renderForm = () => {
        if (isCategoriesError || !categoriesData) {
            return (
                <View>
                    <Text>Error fetching categories</Text>
                </View>
            )
        }

        return (
            <FormProvider {...methods}>
                <Modal.Body isLoading={isCategoriesFetching}>
                    <FormRow>
                        <View>
                            <FormRow>
                                <Picker.HookForm
                                    label='Choose Existing Category'
                                    name='categoryId'
                                    options={getCategoryOptions(categoriesData)}
                                    isDisabled={!!newCategoryValue}
                                />
                            </FormRow>
                            <FormRow>
                                <Text style={styles.or}>OR</Text>
                            </FormRow>
                            <FormRow>
                                <Input.HookForm
                                    label='Create New Category'
                                    name='newCategory'
                                    isDisabled={!!categoryIdValue && categoryIdValue !== 'none'}
                                />
                            </FormRow>
                        </View>
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={close}>
                            Back
                        </Button>
                        <Button onPress={methods.handleSubmit(onSubmit)}>Add Item</Button>
                    </View>
                </Modal.Footer>
            </FormProvider>
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            title='Categorize New Item'
            description={`This is a new item. Please choose a category for "${itemName}".`}
            close={close}
        >
            {renderForm()}
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    or: {
        color: semantic.colorTextPrimary
    }
})
