import { createContext, useContext, useEffect, useState } from 'react'

import { deleteCookie, getCookie } from '@/lib/cookie'

type AuthContextProps = {
  isAuth: boolean
  isAuthInit: boolean
  userEmail: string
  setAuth: (isAuth: boolean) => void
  setUserEmail: (email: string) => void
  logout: () => void
}

export const AuthContext = createContext({} as AuthContextProps)

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setAuth] = useState(false)
  const [isAuthInit, setAuthInit] = useState(false)
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '')

  useEffect(() => {
    const accessToken = getCookie('accessToken')

    if (accessToken) {
      setAuth(true)
    }

    setAuthInit(true)
  }, [])

  const logout = () => {
    setAuth(false)
    deleteCookie('accessToken')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isAuthInit,
        userEmail,
        setAuth,
        setUserEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
