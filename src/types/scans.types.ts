export type ScanStatus = 'invalid_extension' | 'done' | 'processing'

export type Scan = {
  name: string
  size: number
  status: ScanStatus
  id: number
  storedPath: string
}
