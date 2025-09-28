import type { ScanStatus } from '@/types/scans.types'

export type SignInProps = {
  email: string
  password: string
}

export type AccessToken = {
  access_token: string
  token_type: string
}

export type SignUpProps = {
  email: string
  password: string
}

export type Scan = {
  name: string
  size: number
  status: ScanStatus
  id: number
  stored_path: string
}

export type UploadScanProps = {
  scanFiles: File[]
}

export type ScanInfo = {
  name: string
  size: number
  status: ScanStatus
  id: number
  stored_path: string
  result_text: string | null
  result_table: string | null
  result_file: string | null
}

export type ApiKeyData = {
  id: number
  name: string
  revoked: boolean
  created_at: string
}
