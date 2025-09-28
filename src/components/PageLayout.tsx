import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/providers'

import { Sidebar } from './Sidebar'

export const PageLayout = () => {
  const { isAuth } = useAuth()

  if (!isAuth) {
    return <Navigate to='/sign-in' />
  }

  return (
    <div className='relative flex min-h-screen w-full'>
      <Sidebar />

      <main className='min-h-screen w-full bg-gray-50 p-6'>
        <div className='mx-auto max-w-7xl'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
