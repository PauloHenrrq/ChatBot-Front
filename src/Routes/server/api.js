import axios from 'axios'

const token = localStorage.getItem('authToken')

export const api = axios.create({
  baseURL: 'https://chatbot-back-production-d852.up.railway.app'
})

api.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
