import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'

type RemoveAdditionalUserFormProps = {
    email: string
}

export function RemoveAdditionalUserForm({ email }: RemoveAdditionalUserFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: removeAdditionalUser, isPending: isRemoveAdditionalUserPending } = query.account.additionalUsers.delete.useMutation()

    return (
        <View>
            <Pressable onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Remove Additional User' description={email}>
                <View>
                    <Modal.Body>
                        <Text>Are you sure you want to revoke access to your account for this email address?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button
                                color='error'
                                onPress={() => {
                                    removeAdditionalUser(
                                        { additional_user_email: email },
                                        {
                                            onSuccess: (res) => {
                                                flashMessage({
                                                    type: 'success',
                                                    message: res.message
                                                })
                                                setIsOpen(false)
                                            }
                                        }
                                    )
                                }}
                                isLoading={isRemoveAdditionalUserPending}
                            >
                                Remove
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
