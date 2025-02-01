import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Recipe } from '../../../queries/recipes/types'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'

type DeleteRecipeProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
}

export function DeleteRecipe({ recipeId, recipeName }: DeleteRecipeProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: deleteRecipe, isPending: isDeleteRecipePending } = query.recipes.single.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Delete Recipe' description={recipeName}>
                <View>
                    <Modal.Body>
                        <Text>Are you sure you want to delete this recipe?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    deleteRecipe(recipeId.toString(), {
                                        onSuccess: (res) => {
                                            flashMessage({
                                                message: res.message,
                                                type: 'success'
                                            })
                                            setIsOpen(false)
                                        }
                                    })
                                }}
                                isLoading={isDeleteRecipePending}
                            >
                                Delete
                            </Button>
                        </View>
                    </Modal.Footer>
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
