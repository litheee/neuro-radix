import { useQuery } from '@tanstack/react-query'
import { LucideUpload } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { ScansList, ScansListFilters, ScanStatusesCounters } from '@/components'
import { Button } from '@/ui/button'

import * as API from '@/api'

import type { Scan, ScanStatus } from '@/types/scans.types'

type Filters = {
  search?: string
  status?: ScanStatus | 'all'
}

export const DashboardPage = () => {
  const { data: scans = [] } = useQuery({
    queryKey: ['scans-list'],
    queryFn: API.getScansList,
    refetchInterval: (query) => {
      const isSomeScanDoesntLoaded = query.state.data?.some(({ status }) => status !== 'done')

      return isSomeScanDoesntLoaded ? 30_000 : false
    }
  })

  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all'
  })

  const filterScans = (scans: Scan[], filters: Filters) => {
    const withSearch = (scans: Scan[], search?: string) => {
      if (!search) return scans

      return scans.filter((scan) => scan.name.toLowerCase().includes(search.toLowerCase()))
    }

    const withStatus = (scans: Scan[], status?: ScanStatus | 'all') => {
      if (status === 'all') return scans

      return scans.filter((scan) => scan.status === status)
    }

    return withStatus(withSearch(scans, filters.search), filters.status)
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>Панель управления</h1>
          <p className='text-gray-600'>Управление медицинскими сканами и исследованиями</p>
        </div>

        <Button
          className='inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-lg ring-offset-background transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
          asChild
        >
          <Link to='/scan-upload'>
            <LucideUpload className='mr-2' /> Загрузить скан
          </Link>
        </Button>
      </div>

      <ScanStatusesCounters scans={scans} />

      <ScansListFilters onFilterChange={setFilters} />

      <ScansList scans={filterScans(scans, filters)} />
    </div>
  )
}
