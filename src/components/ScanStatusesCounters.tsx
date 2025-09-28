import clsx from 'clsx'
import { Activity, CircleCheckBig, FileImage } from 'lucide-react'

import type { Scan } from '@/types/scans.types'

type ScanStatusesCountersProps = {
  scans: Scan[]
}

export const ScanStatusesCounters = ({ scans }: ScanStatusesCountersProps) => {
  const statuses = [
    {
      label: 'Всего сканов',
      number: scans.length,
      bg: 'bg-blue-100',
      icon: <FileImage className='text-blue-600' />
    },
    {
      label: 'Обработано',
      number: scans.filter(({ status }) => status === 'done').length,
      bg: 'bg-green-100',
      icon: <CircleCheckBig className='text-green-600' />
    },
    {
      label: 'В обработке',
      number: scans.filter(({ status }) => status === 'processing').length,
      bg: 'bg-yellow-100',
      icon: <Activity className='text-yellow-600' />
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {statuses.map(({ label, number, bg, icon }) => {
        return (
          <div
            key={label}
            className='flex items-center justify-between rounded-lg border border-gray-100 bg-white p-6 text-card-foreground shadow-xs backdrop-blur-sm'
          >
            <div>
              <p className='mb-2 text-sm font-medium text-gray-500'>{label}</p>
              <p className='text-3xl font-bold text-gray-900'>{number}</p>
            </div>

            <div className={clsx('flex h-12 w-12 items-center justify-center rounded-xl', bg)}>
              {icon}
            </div>
          </div>
        )
      })}
    </div>
  )
}
