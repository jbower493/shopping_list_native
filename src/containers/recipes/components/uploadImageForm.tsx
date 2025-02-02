import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Recipe } from '../../../queries/recipes/types'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { FormRow } from '../../../components/Form/FormRow'

type UploadImageFormProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    hasExistingImage: boolean
}

export function UploadImageForm({ recipeId, recipeName, isOpen, setIsOpen, hasExistingImage }: UploadImageFormProps) {
    const { mutate: uploadRecipeImage, isPending: isUploadRecipeImagePending } = query.recipes.single.uploadImage.useMutation()

    // TODO: figure out how to do image uploading on native, once I have Minio setup again

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Upload Recipe Image' description={recipeName}>
            <View>
                <Modal.Body>
                    {hasExistingImage ? (
                        <Text>Warning: Uploading a new image for this recipe will permanently remove the current recipe image.</Text>
                    ) : null}
                    <FormRow>
                        <Text>Input</Text>
                    </FormRow>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button onPress={() => {}} isLoading={false}>
                            Upload Image
                        </Button>
                    </View>
                </Modal.Footer>
            </View>
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
