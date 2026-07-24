'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export function IconMedia({
  resource,
  className,
}: {
  resource?: string | MediaType | null
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!resource || failed) return null
  return <Media resource={resource} imgClassName={className} onError={() => setFailed(true)} />
}
