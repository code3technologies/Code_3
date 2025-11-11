'use client'

import type React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AttachmentFieldProps {
  path: string
}

interface Attachment {
  id: string
  filename: string
  mimeType: string
  filesize: number
  url: string
  width?: number
  height?: number
}

const AttachmentsField: React.FC<AttachmentFieldProps> = (props) => {
  const { path } = props
  
  const field = useFormFields(([fields]) => fields?.[path])
  const value = field?.value

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAttachments = async () => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setAttachments([])
        return
      }

      const attachmentList = Array.isArray(value) ? value : [value]
      
      const hasOnlyIds = attachmentList.every(item => typeof item === 'string')
      
      if (!hasOnlyIds) {
        setAttachments(attachmentList as Attachment[])
        return
      }

      setLoading(true)
      try {
        const fetchedAttachments = await Promise.all(
          attachmentList.map(async (id: string) => {
            const res = await fetch(`/api/complaint-attachments/${id}`)
            if (res.ok) {
              const data = await res.json()
              return data as Attachment
            }
            return null
          })
        )
        setAttachments(fetchedAttachments.filter((item): item is Attachment => item !== null))
      } catch (error) {
        console.error('Error fetching attachments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttachments()
  }, [value])

  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <div className="field-type upload">
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Attachments
          </label>
          <p className="text-gray-500 text-sm">No files uploaded with this complaint</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="field-type upload">
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Uploaded Attachments
        </label>
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-sm">Loading attachments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="field-type upload">
      <label className="block text-base font-semibold text-gray-900 mb-3">
        Uploaded Attachments
      </label>
      <p className="text-sm text-gray-600 mb-4">
        Files uploaded by the user with their complaint
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attachments.map((attachment, index) => {
          if (!attachment) return null

          const isImage = attachment.mimeType?.startsWith('image/')
          const url = attachment.url || ''
          const filename = attachment.filename || `File ${index + 1}`
          const fileSize = attachment.filesize 
            ? `${(attachment.filesize / 1024).toFixed(1)} KB`
            : ''

          return (
            <div
              key={attachment.id || index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              {isImage ? (
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={url}
                      alt={filename}
                      fill
                      className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
                      🔍
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <p className="text-xs text-gray-700 truncate font-medium">{filename}</p>
                    {fileSize && <p className="text-xs text-gray-500 mt-1">{fileSize}</p>}
                  </div>
                </a>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className="text-5xl mb-3">📄</div>
                  <p className="text-xs text-gray-700 truncate font-medium mb-1">{filename}</p>
                  {fileSize && <p className="text-xs text-gray-500">{fileSize}</p>}
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AttachmentsField
