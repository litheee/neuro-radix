import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LucideArrowLeft, LucideLoaderCircle, LucideUpload } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { ScanDropzone, ScanInfoForm } from '@/components'
import { Button } from '@/ui/button'
import { Card, CardFooter, CardHeader } from '@/ui/card'
import { Progress } from '@/ui/progress'

import { useUploadedScan } from '@/hooks'
import * as API from '@/api'

export const ScanUploadPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { setUploadedScan } = useUploadedScan()
  const [scans, setScans] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(100)

  const { mutate: uploadScan, isPending: isScanUploading } = useMutation({
    mutationFn: (file: File) => {
      return API.uploadScan({
        scanFile: file,
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total))
          }
        }
      })
    },
    onSuccess: async (data, file) => {
      await setUploadedScan({
        scanId: data.id,
        file
      })

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

      {!isScanUploading ? (
        <>
          <ScanDropzone scans={scans} onScanRemove={removeScan} onScanUpload={setScans} />

          <ScanInfoForm />

          <div className='flex justify-end gap-4'>
            <Button variant='outline' className='h-12 px-8' asChild>
              <Link to='/dashboard'>Отмена</Link>
            </Button>

            <Button
              disabled={scans.length === 0}
              className='h-12 min-w-40 bg-blue-600 hover:bg-blue-700'
              onClick={() => {
                uploadScan(scans[0])
              }}
            >
              <LucideUpload className='mr-2' /> Загрузить
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <h3 className='flex items-center gap-5 text-2xl leading-none font-semibold tracking-tight text-blue-500'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500'>
                <LucideLoaderCircle className='h-7 w-7 animate-spin text-white' />
              </div>

              {uploadProgress !== 100
                ? 'Загрузка файлов'
                : 'Почти закончили, дождитесь окончания...'}
            </h3>
          </CardHeader>

          <CardFooter>
            <div className='flex w-full flex-col'>
              <Progress className='w-full' value={uploadProgress} max={100} />

              <p className='mt-5 flex items-center justify-between'>
                <span>Прогресс загрузки</span>
                <span className='font-bold text-blue-500'>{uploadProgress} %</span>
              </p>

              <p className='mt-1'>Пожалуйста, не закрывайте страницу во время загрузки...</p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
