import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { RecipeCategory } from '../../../queries/recipeCategories/types'

type DeleteRecipeCategoryProps = {
    recipeCategoryName: RecipeCategory['name']
    recipeCategoryId: RecipeCategory['id']
}

export function DeleteRecipeCategory({ recipeCategoryId, recipeCategoryName }: DeleteRecipeCategoryProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: deleteRecipeCategory, isPending: isDeleteRecipeCategoryPending } = query.recipeCategories.single.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Delete Recipe Category' description={recipeCategoryName}>
                <View>
                    <Modal.Body>
                        <Text>
                            Are you sure you want to delete this recipe category? Any recipes assigned to this category will become uncategorized.
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    deleteRecipeCategory(recipeCategoryId.toString(), {
                                        onSuccess: (res) => {
                                            flashMessage({
                                                message: res.message,
                                                type: 'success'
                                            })
                                            setIsOpen(false)
                                        }
                                    })
                                }}
                                isLoading={isDeleteRecipeCategoryPending}
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
