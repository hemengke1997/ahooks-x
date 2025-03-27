import { useState } from 'react'
import { useIsomorphicLayoutEffect } from 'ahooks'
import pTimeout from 'p-timeout'

type ImagesToLoad = (string | (() => Promise<string>))[]

type ImageLoad = { loaded: boolean; error: Error | null; src: string }

async function abortPromise<T = any>(
  promise: () => Promise<T>,
  options: {
    timeout?: number
    abortController: AbortController
  },
) {
  const { timeout = Infinity, abortController } = options

  const res = await pTimeout<T>(promise(), {
    milliseconds: timeout,
    signal: abortController.signal,
  })
  return res
}

export function usePreloadImages(imagesToLoad: ImagesToLoad) {
  const [images, setImages] = useState<ImageLoad[]>([])

  const updateImages = (res: ImageLoad) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.push(res)
      return newImages
    })
  }

  useIsomorphicLayoutEffect(() => {
    let isMounted = true
    const abortControllers: AbortController[] = []

    const loadImage = async (src: string | (() => Promise<string>), controller: AbortController) => {
      try {
        let imageSrc: string
        if (typeof src === 'string') {
          imageSrc = src
        } else {
          imageSrc = await abortPromise(src, { abortController: controller })
        }
        if (!imageSrc) {
          throw new Error('Image source is empty')
        }

        const img = new Image()

        img.fetchPriority = 'low'
        img.onload = () => {
          if (isMounted) {
            updateImages({ loaded: true, error: null, src: imageSrc })
          }
        }
        img.onerror = () => {
          if (isMounted) {
            updateImages({ loaded: false, error: new Error(`Failed to load image: ${imageSrc}`), src: imageSrc })
          }
        }
        img.src = imageSrc

        controller.signal.addEventListener('abort', () => {
          img.src = ''
        })
      } catch (err) {
        if (isMounted) {
          updateImages({ loaded: false, error: err as Error, src: '' })
        }
      }
    }

    const idleCallback = window.requestIdleCallback || window.setTimeout

    const idle = idleCallback(() => {
      imagesToLoad.forEach((src) => {
        const controller = new AbortController()
        abortControllers.push(controller)
        loadImage(src, controller)
      })
    })

    return () => {
      isMounted = false
      const cancel = window.cancelIdleCallback || window.clearTimeout
      cancel(idle)
      abortControllers.forEach((controller) => controller.abort())
    }
  }, [])

  return images
}
