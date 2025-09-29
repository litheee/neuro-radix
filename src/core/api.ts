import axios from 'axios'

import { deleteCookie, getCookie } from '@/lib/cookie'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
})

function handleUnauthorized() {
  deleteCookie('accessToken')
  localStorage.removeItem('userEmail')
  window.location.href = '/sign-in'
}

API.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

API.interceptors.response.use(
  (config) => config,
  (err) => {
    if (err.response && err.response.status === 401) {
      handleUnauthorized()

      return Promise.reject(err)
    }

    return Promise.reject(err)
  }
)
