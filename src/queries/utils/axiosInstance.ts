import axios from 'axios'
import { retrieveToken } from './tokenStorage'

const axiosInstance = axios.create({
    baseURL: 'https://ceca-106-70-122-79.ngrok-free.app',
    withCredentials: false,
    headers: {
        'Shopping-List-Mobile-App': 'true'
    }
})

axiosInstance.interceptors.request.use(async (request) => {
    const token = await retrieveToken()

    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }

    return request
})

axiosInstance.interceptors.response.use((response) => {
    return response.data
})

export { axiosInstance }
