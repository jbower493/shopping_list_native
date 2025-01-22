import type { Category } from '../categories/types'

export interface Item {
    id: number
    name: string
    category: Category | null
    image_url: string | null
}

export interface NewItem {
    name: string
    category_id?: number | null
}

export interface EditItemPayload {
    name: string
    category_id: number | null
}
