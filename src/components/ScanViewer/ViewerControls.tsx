import {
  LucideChevronLeft,
  LucideChevronRight,
  LucidePause,
  LucidePlay,
  LucideSkipBack,
  LucideSkipForward
} from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/ui/button'
import { Slider } from '@/ui/slider'

type ViewerControlsProps = {
  currentSlice: number
  currentSliceRef: React.RefObject<number>
  totalSlices: number
  isPlaying: boolean
  onSliceChange: (idx: number) => void
  onPlayingChange: (value: boolean) => void
}

export const ViewerControls = ({
  isPlaying,
  currentSlice,
  currentSliceRef,
  totalSlices,
  onSliceChange,
  onPlayingChange
}: ViewerControlsProps) => {
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const stopAutoPlay = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
    onPlayingChange(false)
  }

  useEffect(() => {
    return () => {
      stopAutoPlay()
    }
  }, [])

  const startAutoPlay = () => {
    if (totalSlices <= 1) return

    onPlayingChange(true)

    const animate = () => {
      const nextSlice = (currentSliceRef.current + 1) % totalSlices
      onSliceChange(nextSlice)
    }

    animationRef.current = setInterval(animate, 500)
  }

  const toggleAutoPlay = () => {
    if (isPlaying) {
      stopAutoPlay()
    } else {
      startAutoPlay()
    }
  }

  const goToSlice = (sliceIndex: number) => {
    const newIndex = Math.max(0, Math.min(sliceIndex, totalSlices - 1))

    onSliceChange(newIndex)

    if (isPlaying) {
      stopAutoPlay()
    }
  }

  return (
    <div className='mt-4 flex w-full flex-col items-center gap-4'>
      <div className='mb-4 flex items-center justify-center gap-2 [&>button]:h-12 [&>button]:w-12'>
        <Button
          variant='outline'
          onClick={() => {
            goToSlice(0)
          }}
          disabled={totalSlices <= 1}
        >
          <LucideSkipBack />
        </Button>

        <Button
          variant='outline'
          onClick={() => {
            goToSlice(currentSlice + 1)
          }}
          disabled={totalSlices <= 1}
        >
          <LucideChevronLeft />
        </Button>

        <Button
          className='bg-blue-600 hover:bg-blue-700'
          onClick={toggleAutoPlay}
          disabled={totalSlices <= 1}
        >
          {!isPlaying ? <LucidePlay /> : <LucidePause />}
        </Button>

        <Button
          variant='outline'
          onClick={() => {
            goToSlice(currentSlice + 1)
          }}
          disabled={totalSlices <= 1}
        >
          <LucideChevronRight />
        </Button>

        <Button
          variant='outline'
          onClick={() => {
            goToSlice(totalSlices)
          }}
          disabled={totalSlices <= 1}
        >
          <LucideSkipForward />
        </Button>
      </div>

      <div className='flex w-full flex-1 flex-col items-center gap-2'>
        <div className='w-full'>
          <Slider
            value={[currentSlice]}
            min={0}
            max={totalSlices - 1}
            step={1}
            onValueChange={(value) => goToSlice(value[0])}
            disabled={totalSlices <= 1}
            className='flex-1'
          />
        </div>

        <div className='flex w-full justify-between'>
          <span className='text-gray-400'>1</span>

          <span>
            {currentSlice + 1} / {totalSlices}
          </span>

          <span className='text-gray-400'>{totalSlices}</span>
        </div>
      </div>
    </div>
  )
}
