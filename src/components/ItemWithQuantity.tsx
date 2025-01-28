import React from 'react'
import { QuantityUnit } from '../queries/quantityUnits/types'
import { StyleSheet, Text, View } from 'react-native'
import { semantic } from '../designTokens'

interface ItemWithQuantityProps {
    quantityValue: number
    unitSymbol: QuantityUnit['symbol'] | undefined
    itemName: string
}

const unitSymbolsWithSpace: QuantityUnit['symbol'][] = ['cups', 'fl.oz', 'lbs', 'oz', 'tbsp', 'tsp']

export const ItemWithQuantity: React.FC<ItemWithQuantityProps> = ({ quantityValue, unitSymbol, itemName }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.quantity}>
                {quantityValue}
                {unitSymbol && unitSymbolsWithSpace.includes(unitSymbol) ? ' ' : ''}
                {unitSymbol || ''}
            </Text>
            <Text>{itemName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 5
    },
    quantity: {
        color: semantic.colorTextPrimary
    },
    itemName: {}
})
