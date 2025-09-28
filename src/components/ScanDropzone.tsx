import { LucideFileImage, LucideUpload, LucideX } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader } from '@/ui/card'

type ScanDropzoneProps = {
  scans: File[]
  onScanUpload: (files: File[]) => void
  onScanRemove: (name: string) => void
}

export const ScanDropzone = ({ scans, onScanRemove, onScanUpload }: ScanDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onScanUpload(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/octet-stream': ['.nii', '.nii.gz', '.dcm', '.dicom'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/gzip': ['.tar.gz'],
      'application/x-tar': ['.tar.gz']
    },
    multiple: false,
    onDrop
  })

  return (
    <Card>
      <CardHeader>
        <h3 className='flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
          <LucideFileImage /> Выбор файлов
        </h3>
      </CardHeader>

      <CardContent>
        <div
          {...getRootProps()}
          className='relative rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 transition-all duration-200 hover:border-gray-300'
        >
          <input {...getInputProps()} />

          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100'>
              <LucideUpload className='text-blue-600' />
            </div>

            <h3 className='mb-2 text-xl font-semibold text-gray-900'>
              Загрузите медицинские файлы
            </h3>

            <p className='mb-6 text-gray-500'>Перетащите файлы сюда или нажмите для выбора</p>

            <Button className='h-12 bg-blue-600 px-8! py-2 hover:bg-blue-700'>
              <LucideFileImage className='mr-2' /> Выбрать файлы
            </Button>

            <p className='mt-4 text-sm text-gray-400'>
              Поддерживаемые форматы: .nii, .nii.gz, .dicom, .dcm, .zip, .rar, .tar.gz
            </p>
          </div>
        </div>

        {scans.length ? (
          <div className='mt-5'>
            <h4 className='font-semibold text-gray-900'>Выбранные файлы ({scans.length})</h4>

            <div>
              {scans.map(({ name, size }) => {
                return (
                  <div
                    key={name}
                    className='mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4'
                  >
                    <div className='flex items-center gap-3'>
                      <LucideFileImage className='h-8 w-8 text-green-500' />

                      <div>
                        <p className='font-medium text-gray-900'>{name}</p>

                        <p className='text-sm text-gray-500'>
                          {Number(size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>

                    <Button
                      variant='ghost'
                      className='hover:text-red-500'
                      onClick={() => {
                        onScanRemove(name)
                      }}
                    >
                      <LucideX className='h-4 w-4' />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
