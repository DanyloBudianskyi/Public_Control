import axios from "axios";

const API_URL = 'http://192.168.1.71:3000'

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 3000,
})

export const getReports = () => axiosInstance.get('/reports')
export const getReportById = (id) => axiosInstance.get(`/reports/${id}`)
export const getReportsByUserId = (token) =>
    axiosInstance.get(`/reports/me`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const getReportsByDate = (date) => axiosInstance.get(`/reports/date/${date}`)
export const createReport = (report, token) =>
    axiosInstance.post('/reports', report, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
export const updateReport = (id, report) => axiosInstance.patch(`/reports/${id}`, report)
export const deleteReport = (id) => axiosInstance.delete(`/reports/${id}`)