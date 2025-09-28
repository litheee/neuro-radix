import { init as coreInit, Enums, RenderingEngine, StackViewport } from '@cornerstonejs/core'
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import * as API from '@/api'

import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader } from './card'
import { Slider } from './slider'

type MedicalImageViewerProps = {
  filename: string
  maskFilename: string
}

export const MedicalImageViewer = ({ filename, maskFilename }: MedicalImageViewerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlice, setCurrentSlice] = useState(0)
  const [totalSlices, setTotalSlices] = useState(1)
  // const [isMaskVisible, setMaskVisible] = useState(false)
  const renderingEngineRef = useRef<RenderingEngine | null>(null)
  const viewportRefInternal = useRef<StackViewport | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const currentSliceRef = useRef(currentSlice) // Ref для хранения текущего значения

  // Синхронизируем ref с state
  useEffect(() => {
    currentSliceRef.current = currentSlice
  }, [currentSlice])

  // API возвращает ArrayBuffer с Content-Type: application/dicom
  const { data: arrayBuffer, isLoading: isFileLoading } = useQuery({
    queryKey: ['scan-file', filename],
    queryFn: () => API.getScanFile(filename),
    enabled: !!filename
  })

  // const { data: maskArrayBuffer, isLoading: isMaskLoading } = useQuery({
  //   queryKey: ['scan-file', maskFilename],
  //   queryFn: () => API.getScanFile(maskFilename),
  //   enabled: !!maskFilename
  // })

  useEffect(() => {
    const initializeCornerstone = async () => {
      try {
        setLoading(true)
        await coreInit()
        await dicomImageLoaderInit()
        setIsInitialized(true)
        console.log('Cornerstone initialized successfully')
      } catch (err) {
        console.error('Error initializing Cornerstone:', err)
        setError('Failed to initialize viewer')
      } finally {
        setLoading(false)
      }
    }

    initializeCornerstone()

    return () => {
      // Останавливаем анимацию при размонтировании
      stopAutoPlay()
      if (renderingEngineRef.current) {
        renderingEngineRef.current.destroy()
        renderingEngineRef.current = null
      }
    }
  }, [])

  // Функция для создания нескольких imageId (эмуляция нескольких срезов)
  const createImageIdsFromDicomBuffer = (arrayBuffer: ArrayBuffer, filename: string): string[] => {
    const blob = new Blob([arrayBuffer], { type: 'application/dicom' })
    const blobUrl = URL.createObjectURL(blob)

    // Для multi-frame DICOM - один файл содержит все срезы
    // Cornerstone автоматически определяет количество кадров
    return [`wadouri:${blobUrl}`]
  }

  // Автоматическое пролистывание со скоростью 1 слайд в секунду
  const startAutoPlay = () => {
    if (!viewportRefInternal.current || totalSlices <= 1) return

    setIsPlaying(true)

    const animate = () => {
      if (!viewportRefInternal.current) return

      // Используем ref для получения актуального значения
      const nextSlice = (currentSliceRef.current + 1) % totalSlices
      setCurrentSlice(nextSlice)
      viewportRefInternal.current.setImageIdIndex(nextSlice)
      viewportRefInternal.current.render()
    }

    // Запускаем интервал с частотой 1 раз в секунду (1000 мс)
    animationRef.current = setInterval(animate, 1000)
  }

  const stopAutoPlay = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
    setIsPlaying(false)
  }

  const toggleAutoPlay = () => {
    if (isPlaying) {
      stopAutoPlay()
    } else {
      startAutoPlay()
    }
  }

  // Переход к конкретному срезу
  const goToSlice = (sliceIndex: number) => {
    if (!viewportRefInternal.current) return

    const newIndex = Math.max(0, Math.min(sliceIndex, totalSlices - 1))
    setCurrentSlice(newIndex)
    viewportRefInternal.current.setImageIdIndex(newIndex)
    viewportRefInternal.current.render()

    // Если автопрокрутка активна, останавливаем её при ручном переходе
    if (isPlaying) {
      stopAutoPlay()
    }
  }

  // Следующий срез
  const nextSlice = () => {
    goToSlice(currentSlice + 1)
  }

  // Предыдущий срез
  const prevSlice = () => {
    goToSlice(currentSlice - 1)
  }

  // Основная функция для загрузки DICOM
  const loadDicomFile = async (arrayBuffer: ArrayBuffer): Promise<void> => {
    if (!isInitialized || !viewportRef.current) {
      console.error('Cornerstone not initialized or viewport element not available')
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('Loading DICOM file, size:', arrayBuffer.byteLength, 'bytes')

      // Создаем массив imageId (в реальном приложении здесь должны быть разные срезы)
      const imageIds = createImageIdsFromDicomBuffer(arrayBuffer, filename)
      setTotalSlices(imageIds.length)
      setCurrentSlice(0)
      currentSliceRef.current = 0

      console.log('Created imageIds:', imageIds)

      // Инициализируем RenderingEngine
      const renderingEngineId = 'myRenderingEngine'

      if (!renderingEngineRef.current) {
        renderingEngineRef.current = new RenderingEngine(renderingEngineId)
      }

      const renderingEngine = renderingEngineRef.current

      // Создаем Stack viewport
      const viewportId = 'CT_AXIAL_STACK'
      const viewportInput = {
        viewportId,
        element: viewportRef.current,
        type: Enums.ViewportType.STACK
      }

      renderingEngine.enableElement(viewportInput)

      // Получаем StackViewport
      const viewport = renderingEngine.getViewport(viewportId) as StackViewport
      viewportRefInternal.current = viewport

      // Загружаем изображения в стек
      console.log('Setting stack with imageIds...')
      await viewport.setStack(imageIds)

      // Устанавливаем начальный срез
      await viewport.setImageIdIndex(0)

      // Рендерим
      console.log('Rendering...')
      viewport.render()

      console.log('DICOM file loaded and rendered successfully')
    } catch (err) {
      console.error('Error loading DICOM file:', err)
      setError(`Failed to load DICOM file: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Автоматически загружаем когда данные готовы
  useEffect(() => {
    if (arrayBuffer && isInitialized) {
      console.log('ArrayBuffer received, loading DICOM...')
      loadDicomFile(arrayBuffer)
    }
  }, [arrayBuffer, isInitialized])

  if (isFileLoading) {
    return (
      <div className='p-5'>
        <p className='text-lg font-medium'>Загрузка файла с сервера...</p>
      </div>
    )
  }

  if (!arrayBuffer) {
    return (
      <div className='p-5'>
        <p className='text-lg font-medium'>Файл не доступен</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='mb-2.5 flex items-center gap-2.5'>
          <span className='text-sm text-muted-foreground'>
            Статус: {isInitialized ? 'Инициализирован' : 'Инициализация...'} | Файл:{' '}
            {arrayBuffer
              ? `${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`
              : 'Файл остутствует'}
          </span>

          {loading && (
            <span className='animate-pulse text-sm font-medium text-blue-500'>Рендер файла...</span>
          )}
        </div>
      </CardHeader>

      {error && (
        <div className='mx-4 mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-destructive'>
          <strong className='font-semibold'>Ошибка:</strong> {error}
        </div>
      )}

      <CardContent className='px-20'>
        <div
          ref={viewportRef}
          className='aspect-square overflow-hidden rounded-lg border-2 border-border bg-black'
        />
      </CardContent>

      <CardFooter>
        {/* Элементы управления пролистыванием */}
        <div className='mt-4 flex w-full items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={prevSlice}
              disabled={!isInitialized || totalSlices <= 1}
            >
              ←
            </Button>

            <Button
              variant={isPlaying ? 'destructive' : 'default'}
              size='sm'
              onClick={toggleAutoPlay}
              disabled={!isInitialized || totalSlices <= 1}
            >
              {isPlaying ? 'Стоп' : 'Автопрокрутка'}
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={nextSlice}
              disabled={!isInitialized || totalSlices <= 1}
            >
              →
            </Button>
          </div>

          <div className='flex max-w-full flex-1 items-center gap-2'>
            <span className='text-sm whitespace-nowrap text-muted-foreground'>Срез:</span>
            <Slider
              value={[currentSlice]}
              min={0}
              max={totalSlices - 1}
              step={1}
              onValueChange={(value) => goToSlice(value[0])}
              disabled={!isInitialized || totalSlices <= 1}
              className='flex-1'
            />
            <span className='min-w-12 text-sm whitespace-nowrap text-muted-foreground'>
              {currentSlice + 1} / {totalSlices}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
