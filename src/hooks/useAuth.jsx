import { createContext, useContext, useState, useCallback } from 'react'
import DB from '../db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => DB.getUser())

  const login = useCallback((email, pw) => {
    const u = DB.login(email, pw)
    if (u) setUser(u)
    return u
  }, [])

  const register = useCallback((data) => {
    const u = DB.register(data)
    if (u) setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    DB.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((data) => {
    if (!user) return
    const updated = DB.updateUser(user.id, data)
    setUser(updated)
    return updated
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
