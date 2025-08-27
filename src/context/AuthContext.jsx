import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/apiClient'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('auth_token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem('auth_user')
      if (storedUser) setUser(JSON.parse(storedUser))
    }
  }, [token])

  const normalizeRoles = (roles) => {
    const roleList = Array.isArray(roles) ? roles : []
    return roleList
      .map((role) => (typeof role === 'string' ? role : role?.name || role?.role || role?.authority))
      .filter(Boolean)
      .map((role) => role.replace(/^ROLE_/, '').toUpperCase())
  }

  const extractToken = (response) => {
    const data = response?.data || {}
    const headerAuth = response?.headers?.authorization || response?.headers?.Authorization
    const tokenFromHeader = headerAuth?.startsWith('Bearer ') ? headerAuth.slice(7) : undefined
    return data.token || data.accessToken || data.jwt || tokenFromHeader
  }

  const decodeJwt = (jwt) => {
    try {
      const base64 = jwt.split('.')[1]
      const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decodeURIComponent(escape(json)))
    } catch {
      return {}
    }
  }

  const extractUser = (response, fallbackUsername, jwt) => {
    const data = response?.data || {}
    const user = data.user || data.account || data.principal || {}
    const username = user.username || user.email || data.username || data.email || fallbackUsername || decodeJwt(jwt).sub || decodeJwt(jwt).username || decodeJwt(jwt).email
    let roles = normalizeRoles(user.roles || data.roles || data.authorities)

    if (!roles.length && jwt) {
      const claims = decodeJwt(jwt)
      const claimRoles = claims.roles || claims.authorities || claims.scope || claims.scopes
      if (typeof claimRoles === 'string') {
        roles = normalizeRoles(claimRoles.split(/[ ,]/).filter(Boolean))
      } else if (Array.isArray(claimRoles)) {
        roles = normalizeRoles(claimRoles)
      }
    }
    return { username, roles }
  }

  const buildLoginPayload = (username, password) => {
    const userKey = (import.meta.env.VITE_AUTH_USERNAME_KEY || 'username').trim()
    const passKey = (import.meta.env.VITE_AUTH_PASSWORD_KEY || 'password').trim()
    const payload = {}
    payload[userKey] = username
    payload[passKey] = password
    return payload
  }

  const trySilentRefresh = async () => {
    try {
      const refreshPath = import.meta.env.VITE_AUTH_REFRESH_PATH || '/api/user/refresh'
      const res = await api.post(refreshPath)
      const jwt = extractToken(res)
      if (!jwt) return { ok: false }
      const userInfo = extractUser(res, null, jwt)
      localStorage.setItem('auth_token', jwt)
      localStorage.setItem('auth_user', JSON.stringify(userInfo))
      setToken(jwt)
      setUser(userInfo)
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  useEffect(() => {
    // Attempt silent refresh on mount if no token but refresh cookie may exist
    if (!token) {
      setLoading(true)
      trySilentRefresh().finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH || '/api/user/login'
      const asForm = String(import.meta.env.VITE_AUTH_LOGIN_FORM || '').toLowerCase() === 'true'
      const payload = buildLoginPayload(username, password)
      const dataToSend = asForm ? new URLSearchParams(payload) : payload
      const headers = asForm ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined
      const res = await api.post(loginPath, dataToSend, { headers })
      const jwt = extractToken(res)
      if (!jwt) throw new Error('Token missing in response')

      const userInfo = extractUser(res, username, jwt)
      const allowedRoles = (import.meta.env.VITE_AUTH_ALLOWED_ROLES || 'ADMIN,MODERATOR')
        .split(',')
        .map((r) => r.trim().toUpperCase())

      if (!userInfo.roles.some((role) => allowedRoles.includes(role))) {
        throw new Error('Unauthorized role')
      }

      localStorage.setItem('auth_token', jwt)
      localStorage.setItem('auth_user', JSON.stringify(userInfo))
      setToken(jwt)
      setUser(userInfo)

      return { ok: true }
    } catch (error) {
      const msg = (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Login failed'
      )
      console.error('Login failed:', msg)
      logout()
      return { ok: false, message: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken('')
    setUser(null)
  }

  const hasAllowedRole = () => {
    const roles = user?.roles || []
    const allowed = (import.meta.env.VITE_AUTH_ALLOWED_ROLES || 'ADMIN,MODERATOR')
      .split(',')
      .map((r) => r.trim().toUpperCase())
    return roles.some((role) => allowed.includes(role))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasAllowedRole }}>
      {children}
    </AuthContext.Provider>
  )
}
