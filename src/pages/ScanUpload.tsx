import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LucideArrowLeft, LucideUpload } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { ScanDropzone, ScanInfoForm } from '@/components'
import { Button } from '@/ui/button'

import * as API from '@/api'

export const ScanUploadPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [scans, setScans] = useState<File[]>([])

  const { mutate: uploadScan, isPending: isScanUploading } = useMutation({
    mutationFn: API.uploadScan,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['scans-list']
      })
      navigate('/dashboard')
    }
  })

  const removeScan = (name: string) => {
    const withoutDeleted = scans.filter((scan) => scan.name !== name)

    setScans(withoutDeleted)
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' asChild>
          <Link to='/dashboard'>
            <LucideArrowLeft />
          </Link>
        </Button>

        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Загрузка скана</h1>

          <p className='mt-1 text-gray-900 dark:text-gray-400'>
            Загрузите медицинские файлы для обработки и анализа
          </p>
        </div>
      </div>

      <ScanDropzone scans={scans} onScanRemove={removeScan} onScanUpload={setScans} />

      <ScanInfoForm />

      <div className='flex justify-end gap-4'>
        <Button variant='outline' className='h-12 px-8' asChild>
          <Link to='/dashboard'>Отмена</Link>
        </Button>

        <Button
          disabled={scans.length === 0}
          loading={isScanUploading}
          className='h-12 min-w-40 bg-blue-600 hover:bg-blue-700'
          onClick={() => {
            uploadScan({ scanFiles: scans })
          }}
        >
          <LucideUpload className='mr-2' /> Загрузить
        </Button>
      </div>
    </div>
  )
}
