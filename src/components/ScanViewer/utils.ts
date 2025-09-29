import { Enums, RenderingEngine, StackViewport } from '@cornerstonejs/core'
import dicomParser from 'dicom-parser'
import { type RefObject } from 'react'

type LoadDicomFileProps = {
  arrayBuffer: ArrayBuffer
  viewportRef: RefObject<HTMLDivElement | null>
  currentSliceRef: RefObject<number>
  renderingEngineRef: RefObject<RenderingEngine | null>
  viewportRefInternal: RefObject<StackViewport | null>
}

// Создание отдельных imageId для каждого среза
const createImageIdsFromDicomBuffer = (arrayBuffer: ArrayBuffer): string[] => {
  try {
    const byteArray = new Uint8Array(arrayBuffer)
    const dataSet = dicomParser.parseDicom(byteArray)

    const numberOfFrames = dataSet.intString('x00280008') || 1

    const blob = new Blob([arrayBuffer], { type: 'application/dicom' })
    const blobUrl = URL.createObjectURL(blob)

    const imageIds: string[] = []
    for (let frame = 0; frame < numberOfFrames; frame++) {
      const imageId = `wadouri:${blobUrl}&frame=${frame}`
      imageIds.push(imageId)
    }

    return imageIds
  } catch (error) {
    console.error('Error parsing DICOM file:', error)
    const blob = new Blob([arrayBuffer], { type: 'application/dicom' })
    const blobUrl = URL.createObjectURL(blob)
    return [`wadouri:${blobUrl}`]
  }
}

export const loadDicomFile = async ({
  arrayBuffer,
  viewportRef,
  currentSliceRef,
  renderingEngineRef,
  viewportRefInternal
}: LoadDicomFileProps): Promise<{ totalSlices: number }> => {
  if (!viewportRef.current) return { totalSlices: 0 }

  const imageIds = createImageIdsFromDicomBuffer(arrayBuffer)

  if (imageIds.length === 0) {
    throw new Error('No image IDs created from DICOM file')
  }

  currentSliceRef.current = 0

  const renderingEngineId = 'myRenderingEngine'

  if (!renderingEngineRef.current) {
    renderingEngineRef.current = new RenderingEngine(renderingEngineId)
  }

  const renderingEngine = renderingEngineRef.current

  const viewportId = 'CT_AXIAL_STACK'
  const viewportInput = {
    viewportId,
    element: viewportRef.current,
    type: Enums.ViewportType.STACK
  }

  if (!renderingEngine.getViewport(viewportId)) {
    renderingEngine.enableElement(viewportInput)
  }

  const viewport = renderingEngine.getViewport(viewportId) as StackViewport
  viewportRefInternal.current = viewport

  await viewport.setStack(imageIds)

  await viewport.setImageIdIndex(0)

  viewport.render()

  return {
    totalSlices: imageIds.length
  }
}
