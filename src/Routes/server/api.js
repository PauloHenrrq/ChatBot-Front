import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://chatbot-back-production-d852.up.railway.app'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
