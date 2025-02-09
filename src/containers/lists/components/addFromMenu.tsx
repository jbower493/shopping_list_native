import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { flashMessage } from '../../../utils/flashMessage'
import { List } from '../../../queries/lists/types'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormRow } from '../../../components/Form/FormRow'
import { Picker } from '../../../components/Form/Picker'

type AddFromMenuProps = {
    listId: List['id']
}

type Inputs = {
    menuId: string
}

export function AddFromMenu({ listId }: AddFromMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: menusData, isFetching: isMenusFetching, isError: isMenusError } = query.menus.all.useQuery()
    const { mutateAsync: addItemsFromMenu } = query.lists.single.addFromMenu.useMutation()

    const allowedMenuIds = menusData?.map((menu) => menu.id.toString()) || []

    const schema = z.object({
        menuId: z.string().refine((val) => allowedMenuIds.includes(val), { message: 'Must be one of your existing menus.' })
    })

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            menuId: allowedMenuIds[0] || ''
        }
    })

    const {
        handleSubmit,
        formState: { isValid, isSubmitting }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async ({ menuId }) => {
        await addItemsFromMenu(
            { listId: listId.toString() || '', menuId },
            {
                onSuccess: (res) => {
                    flashMessage({
                        type: 'success',
                        message: res.message
                    })
                    setIsOpen(false)
                    methods.reset()
                }
            }
        )
    }

    return (
        <View>
            <Button onPress={() => setIsOpen(true)}>Add From Menu</Button>
            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                title='Add Items From Menu'
                description='Choose a menu to add items from. This will add every item from every recipe in your menu to the current list.'
            >
                <FormProvider {...methods}>
                    <Modal.Body isLoading={isMenusFetching} isError={isMenusError}>
                        <FormRow>
                            <Picker.HookForm
                                label='Menu'
                                name='menuId'
                                options={(menusData || []).map(({ id, name }) => ({
                                    label: name,
                                    value: id.toString()
                                }))}
                            />
                        </FormRow>
                    </Modal.Body>
                    <Modal.Footer>
                        <View style={styles.modalFooter}>
                            <Button color='secondary' onPress={() => setIsOpen(false)}>
                                Back
                            </Button>
                            <Button onPress={handleSubmit(onSubmit)} isDisabled={!isValid} isLoading={isSubmitting}>
                                Add Items To List
                            </Button>
                        </View>
                    </Modal.Footer>
                </FormProvider>
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
