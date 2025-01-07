import { AxiosInstance } from 'axios'
import { createContext } from 'react'

export const FetchContext = createContext<{ axiosInstance: AxiosInstance }>({
    axiosInstance: null!
})
