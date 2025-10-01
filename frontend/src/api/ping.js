import axios from "axios";

const API_URL = 'http://192.168.1.71:3000'

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000
})

export const pingBackend = async () =>{
    try{
        await axiosInstance.get('/ping')
        return true
    }
    catch (err) {
        return false
    }
}