import { useQuery } from '@tanstack/react-query'
import { LucideArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { ScanInfo } from '@/components'
import { DicomViewer } from '@/components/ScanViewer'
import { Button } from '@/ui/button'

import { useUploadedScan } from '@/hooks'
import * as API from '@/api'

export const ScanViewerPage = () => {
  const { id } = useParams()
  const { uploadedScan } = useUploadedScan({ scanId: Number(id) })
  const [scanLoadingProgress, setScanLoadingProgress] = useState(0)

  const { data: scanInfo } = useQuery({
    queryKey: ['scan-info', id],
    queryFn: () => {
      if (!id) return

      return API.getScanInfo(Number(id))
    },
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data

      return data?.status !== 'done' ? 30_000 : false
    }
  })

  const scanFilename = scanInfo?.storedPath.split('uploads/')[1]
  // const scanMaskFilename = scanInfo?.resultFile

  const { data: scanFile, isLoading: isScanLoading } = useQuery({
    queryKey: ['scan-file', scanFilename],
    queryFn: () => {
      if (!scanFilename) return
      return API.getScanFile(scanFilename, (e) => {
        if (e.total) {
          setScanLoadingProgress(Math.round((e.loaded * 100) / e.total))
        }
      })
    },
    enabled: Boolean(scanFilename) && !uploadedScan
  })

  // const { data: scanMaskFile, isLoading: isScanMaskLoading } = useQuery({
  //   queryKey: ['scan-mask-file', scanMaskFilename],
  //   queryFn: () => {
  //     if (!scanMaskFilename) return
  //     return API.getScanMaskFile(scanMaskFilename)
  //   },
  //   enabled: Boolean(scanMaskFilename)
  // })

  if (!scanInfo) return

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
        </div>
      </div>

      <div className='mt-5 grid gap-6 lg:grid-cols-4'>
        <div className='lg:col-span-3'>
          <DicomViewer
            scanFile={uploadedScan?.scan || scanFile}
            loadingProgress={scanLoadingProgress}
            isScanLoading={isScanLoading}
          />
        </div>

        <ScanInfo info={scanInfo} />
      </div>
    </div>
  )
}
