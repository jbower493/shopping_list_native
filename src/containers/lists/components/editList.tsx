import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/Form/Input'
import { FormRow } from '../../../components/Form/FormRow'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { List } from '../../../queries/lists/types'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

type EditListProps = {
    listId: List['id']
    listName: List['name']
}

type Inputs = {
    name: string
}

const schema = z.object({
    name: z.string().min(1, 'Required')
})

export function EditList({ listName, listId }: EditListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { mutateAsync: editList } = query.lists.single.update.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            name: listName
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
        await editList(
            {
                listId: listId.toString(),
                attributes: {
                    name
                }
            },
            {
                onSuccess: (res) => {
                    flashMessage({
                        message: res.message,
                        type: 'success'
                    })
                    setIsOpen(false)
                }
            }
        )
    }

    return (
        <View>
            <Pressable style={styles.titleEditButton} onPress={() => setIsOpen(true)}>
                <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
            </Pressable>
            <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Edit List' description='Update the name of your list'>
                <View>
                    <FormProvider {...methods}>
                        <Modal.Body>
                            <FormRow>
                                <Input.HookForm label='Name' name='name' />
                            </FormRow>
                        </Modal.Body>
                        <Modal.Footer>
                            <View style={styles.modalFooter}>
                                <Button color='secondary' onPress={() => setIsOpen(false)}>
                                    Back
                                </Button>
                                <Button isLoading={isSubmitting} isDisabled={!isValid} onPress={handleSubmit(onSubmit)}>
                                    Save
                                </Button>
                            </View>
                        </Modal.Footer>
                    </FormProvider>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    titleEditButton: {
        marginTop: 3
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    }
})
