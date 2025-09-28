import { useQuery } from '@tanstack/react-query'
import { LucideArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { ScanInfo } from '@/components'
import { Button } from '@/ui/button'
import { MedicalImageViewer } from '@/ui/MedicalImageViewer'

import * as API from '@/api'

export const ScanViewerPage = () => {
  const { id } = useParams()

  const { data: scanInfo, isLoading: isScanInfoLoading } = useQuery({
    queryKey: ['scan-info', id],
    queryFn: () => {
      if (!id) return

      return API.getScanInfo(Number(id))
    },
    enabled: Boolean(id)
  })

  if (!scanInfo) return

  const filename = scanInfo.storedPath.split('uploads/')[1]

  return (
    <div>
      <div className='flex items-center gap-4'>
        <Button variant='outline' asChild>
          <Link to='/dashboard'>
            <LucideArrowLeft />
          </Link>
        </Button>

        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{scanInfo.name}</h1>

          {/* <p className='mt-1 text-gray-900 dark:text-gray-400'>
            Some info text
          </p> */}
        </div>
      </div>

      <div className='mt-5 grid gap-6 lg:grid-cols-4'>
        <div className='lg:col-span-3'>
          <MedicalImageViewer filename={filename} maskFilename={scanInfo.resultFile || ''} />
        </div>

        <ScanInfo info={scanInfo} />
      </div>
    </div>
  )
}
