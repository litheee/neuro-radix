import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { useAuth } from '@/providers'
import * as API from '@/api'
import { setCookie } from '@/lib/cookie'

export const useSignIn = () => {
  const navigate = useNavigate()
  const { setAuth, setUserEmail } = useAuth()

  const {
    mutate: signIn,
    isPending: isSigningIn,
    error
  } = useMutation({
    mutationFn: API.signIn,
    onSuccess: ({ accessToken }, { email }) => {
      setCookie('accessToken', accessToken)
      setAuth(true)
      setUserEmail(email)
      localStorage.setItem('userEmail', email)
      navigate('/dashboard')
    }
  })

  return {
    signIn,
    isSigningIn,
    error
  }
}
