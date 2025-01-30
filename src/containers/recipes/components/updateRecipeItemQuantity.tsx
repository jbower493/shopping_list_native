import { Pressable, StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Text } from '@react-navigation/elements'
import { Button } from '../../../components/Button'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { useState } from 'react'
import { Recipe } from '../../../queries/recipes/types'

type UpdateRecipeItemQuantityProps = {
    recipeId: Recipe['id']
}

export function UpdateRecipeItemQuantity({ recipeId }: UpdateRecipeItemQuantityProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Update Quantity'>
                <View>
                    <Modal.Body>
                        <Text>Update recipe item quantity form</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                onPress={() => {
                                    // TODO
                                }}
                                // isLoading={isDeleteRecipePending}
                            >
                                Update
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
