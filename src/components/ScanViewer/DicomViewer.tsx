import { init as coreInit, RenderingEngine, StackViewport } from '@cornerstonejs/core'
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader'
import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/ui/card'
import { Progress } from '@/ui/progress'

import { loadDicomFile } from './utils'
import { ViewerControls } from './ViewerControls'

type MedicalImageViewerProps = {
  scanFile?: ArrayBuffer
  loadingProgress: number
  isScanLoading: boolean
}

export const DicomViewer = ({
  scanFile,
  loadingProgress,
  isScanLoading
}: MedicalImageViewerProps) => {
  const scanViewportRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlice, setCurrentSlice] = useState(0)
  const [totalSlices, setTotalSlices] = useState(1)
  const renderingEngineRef = useRef<RenderingEngine | null>(null)
  const scanViewportInternalRef = useRef<StackViewport | null>(null)
  const currentSliceRef = useRef(currentSlice)

  useEffect(() => {
    currentSliceRef.current = currentSlice
  }, [currentSlice])

  useEffect(() => {
    const initializeCornerstone = async () => {
      try {
        setLoading(true)
        await coreInit()
        await dicomImageLoaderInit()
        setIsInitialized(true)
      } catch (err) {
        console.error('Error initializing Cornerstone:', err)
        setError('Failed to initialize viewer')
      } finally {
        setLoading(false)
      }
    }

    initializeCornerstone()

    return () => {
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy()
        renderingEngineRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isInitialized || !scanViewportRef.current || !scanFile) return

    const load = async (arrayBuffer: ArrayBuffer) => {
      try {
        setLoading(true)
        setError(null)

        const { totalSlices } = await loadDicomFile({
          arrayBuffer,
          currentSliceRef,
          renderingEngineRef,
          viewportRef: scanViewportRef,
          viewportRefInternal: scanViewportInternalRef
        })

        setTotalSlices(totalSlices)
        setCurrentSlice(0)
      } catch (err) {
        setError(
          `Failed to load DICOM file: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      } finally {
        setLoading(false)
      }
    }

    load(scanFile)
  }, [scanFile, isInitialized])

  if (isScanLoading) {
    return (
      <div className='p-5'>
        <p className='text-lg font-medium'>Загрузка файла с сервера...</p>

        <Progress className='mt-5 w-full' value={loadingProgress} max={100} />
      </div>
    )
  }

  if (!scanFile) {
    return (
      <div className='p-5'>
        <p className='text-lg font-medium'>Файл не доступен</p>
      </div>
    )
  }

  return (
    <Card>
      {loading ? (
        <CardHeader>
          <div className='mb-2.5 flex items-center gap-2.5'>
            {loading && (
              <span className='animate-pulse text-sm font-medium text-blue-500'>
                Рендер файла...
              </span>
            )}
          </div>
        </CardHeader>
      ) : null}

      {error && (
        <div className='mx-4 mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-destructive'>
          <strong className='font-semibold'>Ошибка:</strong> {error}
        </div>
      )}

      <CardContent className='px-30'>
        <div ref={scanViewportRef} className='aspect-square overflow-hidden rounded-lg' />
      </CardContent>

      <CardFooter>
        {isInitialized && scanViewportInternalRef && scanViewportInternalRef.current ? (
          <ViewerControls
            currentSliceRef={currentSliceRef}
            currentSlice={currentSlice}
            isPlaying={isPlaying}
            totalSlices={totalSlices}
            onPlayingChange={setIsPlaying}
            onSliceChange={(newIndex) => {
              if (!scanViewportInternalRef || !scanViewportInternalRef.current) return

              scanViewportInternalRef.current.setImageIdIndex(newIndex)
              scanViewportInternalRef.current.render()
              setCurrentSlice(newIndex)
            }}
          />
        ) : null}
      </CardFooter>
    </Card>
  )
}
