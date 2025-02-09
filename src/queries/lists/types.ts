import { Category } from '../categories/types'
import { QuantityUnit } from '../quantityUnits/types'

export interface List {
    id: number
    name: string
}

export interface NewList {
    name: string
}

export interface DetailedList {
    id: number
    name: string
    items: ListItem[]
}

export interface AddItemToListPayload {
    listId: string
    itemName: string
    quantity: number
    quantityUnitId?: number
    newCategory?: string
    existingCategoryId?: string
}

export interface ListItem {
    id: number
    name: string
    item_quantity: {
        quantity: number
        quantity_unit: QuantityUnit | null
    }
    category: Category | null
    image_url: string | null
}

export interface EditListPayload {
    name: string
}

export interface UpdateListItemQuantityPayload {
    item_id: number
    quantity: number
    quantity_unit_id: number | null
}
