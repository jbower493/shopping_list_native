import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { List } from '../../../queries/lists/types'

type DeleteListProps = {
    listName: List['name']
    listId: List['id']
}

export function DeleteList({ listId, listName }: DeleteListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: deleteList, isPending: isDeleteListPending } = query.lists.single.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Delete List' description={listName}>
                <View>
                    <Modal.Body>
                        <Text>Are you sure you want to delete this list?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    deleteList(listId.toString(), {
                                        onSuccess: (res) => {
                                            flashMessage({
                                                message: res.message,
                                                type: 'success'
                                            })
                                            setIsOpen(false)
                                        }
                                    })
                                }}
                                isLoading={isDeleteListPending}
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
