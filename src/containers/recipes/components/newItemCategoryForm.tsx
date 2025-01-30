import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { query } from '../../../queries'
import { getCategoryOptions } from '../../../utils/functions'
import { Modal } from '../../../components/Modal'
import { FormRow } from '../../../components/Form/FormRow'
import { Picker } from '../../../components/Form/Picker'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/Button'

type Inputs = {
    categoryId: string
}

interface NewItemCategoryFormProps {
    onSubmitFunc: (categoryId: string) => void
    isOpen: boolean
    close: () => void
    itemName: string
}

export function NewItemCategoryForm({ onSubmitFunc, isOpen, close, itemName }: NewItemCategoryFormProps) {
    const { data: categoriesData, isFetching: isCategoriesFetching, isError: isCategoriesError } = query.itemCategories.all.useQuery()

    const methods = useForm<Inputs>({
        mode: 'all'
    })

    const onSubmit: SubmitHandler<Inputs> = async ({ categoryId }) => {
        onSubmitFunc(categoryId)
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
                        <Picker.HookForm label='Category' name='categoryId' options={getCategoryOptions(categoriesData)} />
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={close}>
                            Back
                        </Button>
                        <Button
                            isLoading={methods.formState.isSubmitting}
                            isDisabled={!methods.formState.isValid}
                            onPress={methods.handleSubmit(onSubmit)}
                        >
                            Add Item
                        </Button>
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
    }
})
