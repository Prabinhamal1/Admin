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
    const username = user.username || user.email || data.username || data.email || fallbackUsername
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

  const login = async (username, password) => {
    setLoading(true)
    try {
      const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH || '/api/user/login'
      const res = await api.post(loginPath, { username, password })
      console.log('Login Response:', res)  // Log the full response
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
      console.error('Login failed:', error?.response?.data || error?.message)
      logout()
      return { ok: false, error }
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
