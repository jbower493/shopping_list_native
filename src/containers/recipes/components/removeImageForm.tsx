import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Recipe } from '../../../queries/recipes/types'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'

type RemoveImageFormProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export function RemoveImageForm({ recipeId, recipeName, isOpen, setIsOpen }: RemoveImageFormProps) {
    const { mutate: removeRecipeImage, isPending: isRemoveRecipeImagePending } = query.recipes.single.removeImage.useMutation()

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Remove Recipe Image' description={recipeName}>
            <View>
                <Modal.Body>
                    <Text>Are you sure you want to remove the image from this recipe? The image will be deleted permanently.</Text>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button
                            color='error'
                            onPress={() => {
                                removeRecipeImage(recipeId.toString(), {
                                    onSuccess: (res) => {
                                        flashMessage({
                                            message: res.message,
                                            type: 'success'
                                        })
                                        setIsOpen(false)
                                    }
                                })
                            }}
                            isLoading={isRemoveRecipeImagePending}
                        >
                            Remove Image
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
