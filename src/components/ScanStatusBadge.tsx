import { Badge } from '@/ui/badge'

import type { ScanStatus } from '@/types/scans.types'

export const ScanStatusBadge = ({ status }: { status: ScanStatus }) => {
  switch (status) {
    case 'done':
      return <Badge className='border-green-200 bg-green-100 text-green-800'>Готов</Badge>
    case 'invalid_extension':
      return <Badge className='border-red-200 bg-red-100 text-red-800'>Ошибка</Badge>
    case 'processing':
      return <Badge className='border-blue-200 bg-blue-100 text-blue-800'>В обработке</Badge>
  }
}
