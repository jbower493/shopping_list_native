import { StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Text } from '@react-navigation/elements'
import { Button } from '../../../components/Button'

type EditRecipeFormProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    recipeId: string
}

export function EditRecipeForm({ recipeId, isOpen, setIsOpen }: EditRecipeFormProps) {
    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Edit Recipe'>
            <View>
                <Modal.Body>
                    <Text>Edit recipe form</Text>
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button
                            color='error'
                            onPress={() => {
                                // TODO
                            }}
                            // isLoading={isDeleteRecipePending}
                        >
                            Save
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
