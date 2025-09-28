import { AboutPage } from '@/pages/About'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { Toaster } from '@/ui/sonner'

import { useAuth } from '@/providers'

import {
  DashboardPage,
  ProfilePage,
  ScanUploadPage,
  ScanViewerPage,
  SignInPage,
  SignUpPage
} from '../pages'
import { AuthLayout } from './AuthLayout'
import { PageLayout } from './PageLayout'

export const App = () => {
  const { isAuthInit } = useAuth()

  if (!isAuthInit) return

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/sign-in' element={<SignInPage />} />
            <Route path='/sign-up' element={<SignUpPage />} />
          </Route>

          <Route element={<PageLayout />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/scan-upload' element={<ScanUploadPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/scan-viewer/:id' element={<ScanViewerPage />} />

            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position='bottom-right' />
    </>
  )
}
