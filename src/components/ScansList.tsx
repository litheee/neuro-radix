import { LucideFileImage } from 'lucide-react'

import { ScanItem } from './ScanItem'

import type { Scan } from '@/types/scans.types'

type ScansListProps = {
  scans: Scan[]
}

export const ScansList = ({ scans }: ScansListProps) => {
  return (
    <div>
      <div className='mb-6 flex items-center gap-2'>
        <LucideFileImage />

        <h2 className='text-xl font-semibold text-gray-900'>Все сканы ({scans.length})</h2>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {scans.map(({ id, name, status, storedPath }) => (
          <ScanItem key={id} id={id} name={name} status={status} storedPath={storedPath} />
        ))}
      </div>
    </div>
  )
}
