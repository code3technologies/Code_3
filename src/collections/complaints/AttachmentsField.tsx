'use client'

import type React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { useState, useEffect } from 'react'

const AttachmentsField: React.FC<any> = (props) => {
  const { path } = props
  
  // Get the field value from form state
  const field = useFormFields(([fields]) => fields?.[path])
  const value = field?.value

  const [attachments, setAttachments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch attachment data if we only have IDs
  useEffect(() => {
    const fetchAttachments = async () => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setAttachments([])
        return
      }

      const attachmentList = Array.isArray(value) ? value : [value]
      
      // Check if we have IDs (strings) or already populated objects
      const hasOnlyIds = attachmentList.every(item => typeof item === 'string')
      
      if (!hasOnlyIds) {
        // Already populated
        setAttachments(attachmentList)
        return
      }

      // Fetch the full attachment data
      setLoading(true)
      try {
        const fetchedAttachments = await Promise.all(
          attachmentList.map(async (id: string) => {
            const res = await fetch(`/api/complaint-attachments/${id}`)
            if (res.ok) {
              const data = await res.json()
              return data
            }
            return null
          })
        )
        setAttachments(fetchedAttachments.filter(Boolean))
      } catch (error) {
        console.error('Error fetching attachments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttachments()
  }, [value])

  // Show empty state if no attachments
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

  // Show loading state
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

  // Show attachments
  return (
    <div className="field-type upload">
      <label className="block text-base font-semibold text-gray-900 mb-3">
        Uploaded Attachments
      </label>
      <p className="text-sm text-gray-600 mb-4">
        Files uploaded by the user with their complaint
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attachments.map((attachment: any, index: number) => {
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
                  <div className="relative">
                    <img
                      src={url}
                      alt={filename}
                      className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
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
