import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Send cookies (e.g., refresh token cookie) with requests
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const path = (config?.url || '').toString()
  const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH || '/api/user/login'
  const refreshPath = import.meta.env.VITE_AUTH_REFRESH_PATH || '/api/user/refresh'
  const isLogin = path.includes(loginPath)
  const isRefresh = path.includes(refreshPath)
  if (!isLogin && !isRefresh) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

let isRefreshing = false
let pendingQueue = []

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config || {}
    const status = error?.response?.status
    const refreshPath = import.meta.env.VITE_AUTH_REFRESH_PATH || '/api/user/refresh'

    // Avoid infinite loop and only attempt refresh once per request
    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url && originalRequest.url.includes(refreshPath)) {
        // Refresh failed
        processQueue(error, null)
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue requests until refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((newToken) => {
          if (newToken) {
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          originalRequest._retry = true
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const response = await api.post(refreshPath)
        const data = response?.data || {}
        const headerAuth = response?.headers?.authorization || response?.headers?.Authorization
        const headerToken = headerAuth?.startsWith('Bearer ') ? headerAuth.slice(7) : undefined
        const newToken = data.token || data.accessToken || data.jwt || headerToken
        if (!newToken) throw new Error('Missing token from refresh response')

        localStorage.setItem('auth_token', newToken)
        processQueue(null, newToken)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Optionally clear auth and redirect
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api 