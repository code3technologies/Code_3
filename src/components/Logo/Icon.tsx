'use client'

import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <Image
      src="/favicon.svg"
      alt="Icon"
      width={64}
      height={32}
      priority
    />
  )
}
