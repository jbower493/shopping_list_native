import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://8eee-106-70-122-79.ngrok-free.app'
})

axiosInstance.interceptors.response.use((response) => {
    return response.data
})

export { axiosInstance }
