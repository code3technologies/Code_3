'use client'
import dynamic from 'next/dynamic'
import React from 'react'

// Prism (~86 KB) lives in its own chunk. Every page that renders rich text from
// a client component (e.g. the contact form) registers this component, which
// used to put Prism in the JS of nearly every page. Splitting it here means it
// is only fetched where a code block actually renders; it is still
// server-rendered, so the highlighted code is in the HTML either way.
const Highlighted = dynamic(() => import('./Highlighted').then((m) => m.Highlighted))

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null
  return <Highlighted code={code} language={language} />
}
