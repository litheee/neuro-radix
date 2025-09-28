import clsx from 'clsx'
import { ClipboardList, LucideHome, LucideUpload, LucideUser } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import logoImg from '../assets/logo.png'

export const Sidebar = () => {
  const { pathname } = useLocation()

  const nav = [
    { label: 'Главная', href: '/dashboard', Icon: LucideHome },
    { label: 'Загрузить скан', href: '/scan-upload', Icon: LucideUpload }
  ]

  return (
    <div>
      <div className='w-[16rem]' />

      <aside className='fixed flex min-h-screen w-full max-w-[16rem] flex-col border-r border-gray-200 bg-white'>
        <div className='flex flex-col gap-2 border-b border-gray-100 p-6'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10'>
              <img src={logoImg} alt='логотип' />
            </div>

            <div>
              <h2 className='text-lg font-bold text-blue-600'>Neuro Radix</h2>
              <p className='text-xs text-gray-500'>Система обработки сканов</p>
            </div>
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4'>
          <div className='relative flex w-full min-w-0 flex-1 flex-col p-2'>
            <p className='flex h-8 shrink-0 items-center rounded-md px-3 py-3 text-xs font-semibold tracking-wider text-gray-400 uppercase ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear outline-none group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0'>
              Навигация
            </p>

            <div className='flex w-full flex-1 flex-col text-sm'>
              <ul className='flex w-full min-w-0 flex-1 flex-col gap-1 space-y-1'>
                {nav.map(({ label, href, Icon }) => {
                  const isActive = pathname === href

                  return (
                    <li key={href}>
                      <Link
                        to={href}
                        className={clsx(
                          isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600',
                          'flex items-center gap-3 rounded-lg p-2 px-4! font-medium transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700'
                        )}
                      >
                        <Icon className='h-4 w-4' /> {label}
                      </Link>
                    </li>
                  )
                })}

                <li className='mt-auto'>
                  <Link
                    to='/about'
                    className={clsx(
                      pathname === '/about' ? 'bg-blue-100 text-blue-700' : 'text-gray-600',
                      'flex items-center gap-3 rounded-lg p-2 px-4! font-medium transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700'
                    )}
                  >
                    <ClipboardList className='h-4 w-4' /> О проекте
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2 border-t border-gray-100 p-4'>
          <Link
            to='/profile'
            className='group flex flex-1 items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-transform group-hover:scale-105'>
              <LucideUser className='h-4 w-4 text-white' />
            </div>

            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-gray-900'>Аккаунт</p>
              <p className='truncate text-xs text-gray-500'>Настройки и профиль</p>
            </div>
          </Link>
        </div>
      </aside>
    </div>
  )
}
