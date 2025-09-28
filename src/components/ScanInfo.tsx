import { LucideClipboardList, LucideExternalLink, LucideFileImage } from 'lucide-react'

import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Label } from '@/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/ui/table'

import { ScanStatusBadge } from './ScanStatusBadge'

import type { ScanStatus } from '@/types/scans.types'

type ScanInfo = {
  id: number
  name: string
  resultFile: string | null
  resultTable: string | null
  resultText: string | null
  size: number
  status: ScanStatus
  storedPath: string
}

type ScanInfoProps = {
  info: ScanInfo
}

export const ScanInfo = ({ info }: ScanInfoProps) => {
  const { status, storedPath, resultText, resultTable, size } = info

  const fileExtension = storedPath ? storedPath.split('.')[1].toUpperCase() : '-'

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-2xl leading-none font-semibold tracking-tight'>
          Информация о скане
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <div>
          <Label>Статус</Label>

          <div className='mt-2'>
            <ScanStatusBadge status={status} />
          </div>
        </div>

        <div>
          <Label>Формат</Label>

          <p className='mt-2 flex items-center gap-2'>
            <LucideFileImage className='h-4 w-4' /> {fileExtension}
          </p>
        </div>

        <div>
          <Label>Размер</Label>

          <p className='mt-2'>{Number(size / 1024 / 1024).toFixed(1)} MB</p>
        </div>

        <div>
          <Label>Отчет</Label>

          <p className='mt-2 flex gap-2'>
            <LucideClipboardList className='mt-1 h-4 w-4' /> {resultText || '-'}
          </p>

          {resultTable ? (
            <Table className='mt-2'>
              <TableBody>
                {Object.entries(JSON.parse(resultTable)).map(([key, value]) => {
                  return (
                    <TableRow key={key} className='flex'>
                      <TableCell className='flex-1'>{key}</TableCell>
                      <TableCell className='flex-1'>{String(value)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          asChild={Boolean(storedPath)}
          disabled={!storedPath}
          className='h-10 w-full flex-row bg-blue-600 hover:bg-blue-700'
        >
          <a href='#' className='flex gap-2.5'>
            <LucideExternalLink />
            Скачать оригинал
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
