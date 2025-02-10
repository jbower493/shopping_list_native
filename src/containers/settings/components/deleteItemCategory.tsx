import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { Category } from '../../../queries/categories/types'

type DeleteItemCategoryProps = {
    categoryName: Category['name']
    categoryId: Category['id']
}

export function DeleteItemCategory({ categoryName, categoryId }: DeleteItemCategoryProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: deleteCategory, isPending: isDeleteCategoryPending } = query.itemCategories.single.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Delete Category' description={categoryName}>
                <View>
                    <Modal.Body>
                        <Text>Are you sure you want to delete this category? Any items assigned to this category will become uncategorized.</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    deleteCategory(categoryId.toString(), {
                                        onSuccess: (res) => {
                                            flashMessage({
                                                message: res.message,
                                                type: 'success'
                                            })
                                            setIsOpen(false)
                                        }
                                    })
                                }}
                                isLoading={isDeleteCategoryPending}
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
