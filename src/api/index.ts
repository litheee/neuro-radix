import { API } from '@/core/api'
import type { AxiosProgressEvent } from 'axios'

import type {
  AccessToken,
  ApiKeyData,
  Scan,
  ScanInfo,
  ScanUploadedData,
  SignInProps,
  SignUpProps,
  UploadScanProps
} from './api.types'

export const signIn = async ({ email, password }: SignInProps) => {
  const { data } = await API.post<AccessToken>(
    '/auth/login',
    {
      username: email,
      password
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  return { accessToken: data.access_token }
}

export const signUp = ({ email, password }: SignUpProps) => {
  return API.post('/auth/register', {
    email,
    password
  })
}

export const getScansList = async () => {
  const { data } = await API.get<Scan[]>('/files/list')

  const scans = data.map(({ stored_path, ...props }) => ({ storedPath: stored_path, ...props }))

  return scans
}

export const uploadScan = async ({ scanFile, onUploadProgress }: UploadScanProps) => {
  const formData = new FormData()

  formData.append('file', scanFile)

  const { data } = await API.post<ScanUploadedData>('/files/upload', formData, {
    onUploadProgress
  })

  return data
}

export const getScanInfo = async (scanId: number) => {
  const { data } = await API.get<ScanInfo>(`/files/${scanId}`)

  const {
    id,
    name,
    result_file: resultFile,
    result_table: resultTable,
    result_text: resultText,
    size,
    status,
    stored_path: storedPath
  } = data

  return {
    id,
    name,
    resultFile,
    resultTable,
    resultText,
    size,
    status,
    storedPath
  }
}

export const getApiKeys = async () => {
  const { data } = await API.get<ApiKeyData[]>('/api-keys')

  return data
}

export const createApiKey = (token: string) => {
  return API.post('/api-keys', {
    name: token
  })
}

export const getScanFile = async (
  filename: string,
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const { data } = await API.get<ArrayBuffer>(`/upload/${filename}`, {
    responseType: 'arraybuffer',
    headers: {
      Accept: 'application/dicom'
    },
    onDownloadProgress
  })

  return data
}

export const getScanMaskFile = async (filename: string) => {
  const { data } = await API.get<ArrayBuffer>(`/upload/${filename}`)

  return data
}
