'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  // Fetched client-side instead of passed down from the server layout - the
  // layout deliberately never calls draftMode() itself, since that would force
  // every page on the site to render dynamically. See /api/draft-status.
  const [preview, setPreview] = useState(false)
  // PayloadAdminBar fires its own /api/users/me auth check as soon as it
  // mounts, on every page load for every visitor (not just logged-in admins)
  // - that request competes for bandwidth during the critical initial render.
  // The bar is invisible to the ~100% of visitors who aren't admins anyway,
  // so there's no visible cost to deferring the mount a couple seconds.
  const [ready, setReady] = useState(false)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const refreshPreviewStatus = React.useCallback(() => {
    fetch('/api/draft-status')
      .then((res) => res.json())
      .then((data) => setPreview(Boolean(data?.isEnabled)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!ready) return
    refreshPreviewStatus()
  }, [ready, refreshPreviewStatus])

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  if (!ready) return null

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-foreground', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          preview={preview}
          className="py-2 text-foreground"
          classNames={{
            controls: 'font-medium text-foreground',
            logo: 'text-foreground',
            user: 'text-foreground',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              refreshPreviewStatus()
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
