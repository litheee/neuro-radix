import { Outlet, useLocation } from 'react-router'

import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/card'

import logoSrc from '../assets/logo.png'

export const AuthLayout = () => {
  const { pathname } = useLocation()

  const getDescriptionText = (pathname: string) => {
    switch (pathname) {
      case '/sign-in':
        return 'Войдите, чтобы продолжить'
      case '/sign-up':
        return 'Зарегистрируйтесь, чтобы начать пользоваться'
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle>
            <img className='mx-auto flex h-25 w-25 justify-center' src={logoSrc} alt='лого' />

            <h1 className='mt-5 text-2xl font-bold tracking-tight text-slate-900'>
              Добро пожаловать в <span className='text-blue-600'>Neuro Radix</span>
            </h1>
          </CardTitle>

          <CardDescription>
            <p className='text-slate-500'>{getDescriptionText(pathname)}</p>
          </CardDescription>
        </CardHeader>

        <Outlet />
      </Card>
    </div>
  )
}
