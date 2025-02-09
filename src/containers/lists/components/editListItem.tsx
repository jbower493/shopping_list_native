import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Pressable, StyleSheet, View } from 'react-native'
import { ItemWithQuantity } from '../../../components/ItemWithQuantity'
import { semantic } from '../../../designTokens'
import { query } from '../../../queries'
import { ListItem } from '../../../queries/lists/types'
import { UpdateListItem } from './updateListItem'

interface EditListItemProps {
    item: ListItem
    listId: number
}

export function EditListItem({ item: { name, id, item_quantity }, listId }: EditListItemProps) {
    const { mutate: removeItemFromList } = query.lists.single.removeItem.useMutation()

    function removeItem() {
        removeItemFromList({ listId: listId.toString(), itemId: id })
    }

    return (
        <View style={styles.container}>
            <ItemWithQuantity quantityValue={item_quantity.quantity} unitSymbol={item_quantity.quantity_unit?.symbol} itemName={name} />
            <View style={styles.buttonsContainer}>
                <UpdateListItem listId={listId} itemId={id} />
                <Pressable onPress={() => removeItem()}>
                    <MaterialCommunityIcon name='delete' size={22} color={semantic.colorTextPrimary} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
    }
})
