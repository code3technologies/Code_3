'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'
import type { Props as MediaProps } from '../types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { shimmer, toBase64 } from '@/utilities/shimmer'
import Image from 'next/image'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      const handleLoadedData = () => setIsLoading(false)
      const handleError = () => setIsLoading(false)
      
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
      }
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, width, height } = resource

    const shimmerDataURL = `data:image/svg+xml;base64,${toBase64(
      shimmer(width || 800, height || 450)
    )}`

    return (
      <div className="relative">
        {isLoading && (
          <div
            className={cn(
              'absolute inset-0 z-10 overflow-hidden rounded-lg',
              videoClassName
            )}
            style={{
              aspectRatio: width && height ? `${width}/${height}` : '16/9',
            }}
          >
            <Image
              src={shimmerDataURL}
              alt="Loading video..."
              layout="fill"
              className="object-cover w-full h-full"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-gray-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <video
          autoPlay
          className={cn(videoClassName, isLoading && 'invisible')}
          controls={false}
          loop
          muted
          onClick={onClick}
          playsInline
          ref={videoRef}
        >
          <source src={getMediaUrl(`/media/${filename}`)} />
        </video>
      </div>
    )
  }

  return null
}
