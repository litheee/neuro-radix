import { createContext, useContext, useEffect, useState } from 'react'

import { getCookie } from '@/lib/cookie'

type AuthContextProps = {
  isAuth: boolean
  isAuthInit: boolean
  userEmail: string
  setAuth: (isAuth: boolean) => void
  setUserEmail: (email: string) => void
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

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isAuthInit,
        userEmail,
        setAuth,
        setUserEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
