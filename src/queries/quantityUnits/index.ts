import { useQuery } from '@tanstack/react-query'
import { QuantityUnit } from './types'
import { QueryKeySet } from '../utils/keyFactory'
import { QueryResponse } from '../utils/types'
import { useContext } from 'react'
import { FetchContext } from '../utils/fetchContext'
import { AxiosInstance } from 'axios'

const quantityUnitsKeySet = new QueryKeySet('QuantityUnit')

/***** Get quantity units *****/
export const quantityUnitsQueryKey = quantityUnitsKeySet.many
export const getQuantityUnits = (axiosInstance: AxiosInstance): Promise<QueryResponse<{ quantity_units: QuantityUnit[] }>> =>
    axiosInstance.get('/api/quantity-unit')

export function useQuantityUnitsQuery() {
    const { axiosInstance } = useContext(FetchContext)

    return useQuery({
        queryKey: quantityUnitsQueryKey(),
        queryFn: () => getQuantityUnits(axiosInstance),
        select: (res) => res.data.quantity_units
    })
}
