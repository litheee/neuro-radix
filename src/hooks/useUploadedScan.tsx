import { useQuery, useQueryClient } from '@tanstack/react-query'

type UploadedScan = {
  id: number
  scan: ArrayBuffer
}

type UseUploadedScansProps = {
  scanId?: number
}

function fileToArrayBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export const useUploadedScan = ({ scanId }: UseUploadedScansProps = {}) => {
  const queryClient = useQueryClient()

  const { data: uploadedScan } = useQuery<UploadedScan>({
    queryKey: ['uploaded-scans', scanId],
    enabled: Boolean(scanId)
  })

  return {
    uploadedScan,
    setUploadedScan: async ({ scanId, file }: { scanId: number; file: File }) => {
      const fileArrayBuffer = await fileToArrayBuffer(file)
      const currentScans = (queryClient.getQueryData(['uploaded-scans']) as UploadedScan[]) || []
      const newScan = {
        id: scanId,
        scan: fileArrayBuffer
      }

      await queryClient.setQueryData(['uploaded-scans'], [...currentScans, newScan])
      await queryClient.setQueryData(['uploaded-scans', scanId], newScan)
    }
  }
}
