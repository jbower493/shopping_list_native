import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RecipeItem } from '../../../queries/recipes/types'
import { Pressable, StyleSheet, View } from 'react-native'
import { ItemWithQuantity } from '../../../components/ItemWithQuantity'
import { semantic } from '../../../designTokens'
import { query } from '../../../queries'

interface EditRecipeItemProps {
    item: RecipeItem
    recipeId: number
}

export function EditRecipeItem({ item: { name, id, item_quantity }, recipeId }: EditRecipeItemProps) {
    const { mutate: removeItemFromRecipe } = query.recipes.single.removeItem.useMutation()

    function removeItem() {
        removeItemFromRecipe({ recipeId: recipeId.toString(), itemId: id })
    }

    return (
        <View style={styles.container}>
            <ItemWithQuantity quantityValue={item_quantity.quantity} unitSymbol={item_quantity.quantity_unit?.symbol} itemName={name} />
            <View style={styles.buttonsContainer}>
                <Pressable
                    onPress={() => {
                        // navigate(`/recipes/edit/${recipeId}/update-item-quantity/${id}`)
                    }}
                >
                    <MaterialCommunityIcon name='square-edit-outline' size={22} color={semantic.colorTextPrimary} />
                </Pressable>
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
