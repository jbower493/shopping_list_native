import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { Menu } from '../../../queries/menus/types'

type DeleteMenuProps = {
    menuName: Menu['name']
    menuId: Menu['id']
}

export function DeleteMenu({ menuId, menuName }: DeleteMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: deleteMenu, isPending: isDeleteMenuPending } = query.menus.single.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Delete Menu' description={menuName}>
                <View>
                    <Modal.Body>
                        <Text>Are you sure you want to delete this menu?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    deleteMenu(menuId.toString(), {
                                        onSuccess: (res) => {
                                            flashMessage({
                                                message: res.message,
                                                type: 'success'
                                            })
                                            setIsOpen(false)
                                        }
                                    })
                                }}
                                isLoading={isDeleteMenuPending}
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
