import { FileImage, LucideExternalLink, LucidePlay } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/ui/button'
import { Card, CardFooter, CardHeader } from '@/ui/card'

import { ScanStatusBadge } from './ScanStatusBadge'

import type { ScanStatus } from '@/types/scans.types'

type ScanItemProps = {
  id: number
  name: string
  status: ScanStatus
  storedPath: string
}

export const ScanItem = ({ id, name, storedPath, status }: ScanItemProps) => {
  const scanLink = `${import.meta.env.VITE_API_BASE}/upload/${storedPath.split('uploads/')[1]}`

  return (
    <Card>
      <CardHeader className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100'>
          <FileImage className='text-blue-600' />
        </div>

        <div>
          <h3 className='line-clamp-1 text-lg font-semibold tracking-tight text-gray-900'>
            {name}
          </h3>

          <div className='mt-1 flex gap-2'>
            <ScanStatusBadge status={status} />
          </div>
        </div>
      </CardHeader>

      {/* <CardContent></CardContent> */}

      <CardFooter className='gap-2'>
        <Button className='flex-1 bg-blue-600 hover:bg-blue-700' asChild>
          <Link to={`/scan-viewer/${id}`}>
            <LucidePlay className='mr-2' /> Просмотр
          </Link>
        </Button>

        <Button variant='outline' asChild>
          <a href={scanLink} download>
            <LucideExternalLink />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
