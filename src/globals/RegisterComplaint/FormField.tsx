'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Form } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'

const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 5

type FormFieldType = {
  name: string
  label?: string | null | undefined
  blockType: string
  required?: boolean
  rows?: number
  options?: Array<{ label: string; value: string }>
}

type FormDataType = Record<string, string | number | boolean>

const FormField: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [fileError, setFileError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [formData, setFormData] = useState<FormDataType>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch('/api/forms?where[title][equals]=Complaint Form&limit=1')
        const data = await res.json()
        setForm(data.docs[0] || null)
      } catch (error) {
        console.error('Error fetching form:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [])

  const validateFiles = (selectedFiles: FileList): boolean => {
    setFileError('')

    if (selectedFiles.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed`)
      return false
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]

      if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
        setFileError(
          `File &quot;${file.name}&quot; has unsupported format. Allowed: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX`,
        )
        return false
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File &quot;${file.name}&quot; exceeds 5MB limit`)
        return false
      }
    }
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files

    if (!selectedFiles || selectedFiles.length === 0) {
      setFiles(null)
      setPreviews([])
      setFileError('')
      return
    }

    if (!validateFiles(selectedFiles)) {
      e.target.value = ''
      setFiles(null)
      setPreviews([])
      return
    }

    setFiles(selectedFiles)

    const previewUrls: string[] = []
    Array.from(selectedFiles).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          previewUrls.push(reader.result as string)
          setPreviews([...previewUrls])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    form?.fields?.forEach((field) => {
      const f = field as unknown as FormFieldType
      if (f.required && !formData[f.name]) {
        errors[f.name] = `${f.label || f.name} is required`
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitComplaint = async () => {
    if (!validateForm()) {
      setSubmitError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const attachmentIds: string[] = []

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const fileFormData = new FormData()
          fileFormData.append('file', files[i])

          const uploadRes = await fetch(`${getClientSideURL()}/api/complaint-attachments`, {
            method: 'POST',
            credentials: 'include',
            body: fileFormData,
          })

          if (uploadRes.ok) {
            const uploadedFile = await uploadRes.json()
            attachmentIds.push(uploadedFile.doc.id)
          }
        }
      }

      const dataToSend = Object.entries(formData)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([name, value]) => ({
          field: name,
          value,
        }))

      const response = await fetch(`${getClientSideURL()}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          form: form?.id,
          submissionData: dataToSend,
          attachments: attachmentIds,
          status: 'pending',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit complaint')
      }

      setSubmitSuccess(true)
      setFormData({})
      setFiles(null)
      setPreviews([])

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit complaint')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormFieldType) => {
    const fieldLabel = field.label || field.name  // ✅ Fallback to name if label is null
    
    const commonProps = {
      id: field.name,
      value: String(formData[field.name] || ''),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleInputChange(field.name, e.target.value),
      required: field.required ?? false,
    }

    switch (field.blockType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input {...commonProps} type={field.blockType} placeholder={fieldLabel} />
            {formErrors[field.name] && (
              <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
            )}
          </div>
        )

      case 'textarea':
      case 'message':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea {...commonProps} rows={field.rows || 4} placeholder={fieldLabel} />
            {formErrors[field.name] && (
              <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <select
              {...commonProps}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select {fieldLabel}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors[field.name] && (
              <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={Boolean(formData[field.name])}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={field.name} className="font-normal">
              {fieldLabel}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      default:
        return null
    }
  }


  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading complaint form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-2">Form Not Found</h2>
        <p className="text-red-700">
          No complaint form is currently available. Please create a form with the title &quot;Complaint
          Form&quot; in the Forms collection.
        </p>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="p-6 border border-green-200 rounded-lg bg-green-50 max-w-4xl">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
          ✅ Complaint Submitted Successfully!
        </h2>
        <p className="text-green-700">
          Your complaint has been registered and is now pending review. You can view it in the
          Complaints section.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {submitError}
        </div>
      )}

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">{form.title}</h3>
          {form.confirmationMessage && (
            <p className="text-gray-600 text-sm">{form.submitButtonLabel}</p>
          )}
        </div>

        {form.fields?.map((field) => renderField(field as FormFieldType))}
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <Label htmlFor="attachments" className="text-base font-semibold block mb-2">
          Attachments (Optional)
        </Label>
        <Input
          id="attachments"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="file:mr-4 py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
        <p className="text-sm text-gray-500 mt-2">
          Allowed: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX (Max 5 files, 5MB each)
        </p>

        {fileError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            ⚠️ {fileError}
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Previews:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative border rounded-lg overflow-hidden">
                  <div className="relative w-full h-32">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <p className="text-xs text-center p-1 bg-gray-100 truncate">
                    {files?.[index]?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {files && files.length > 0 && (
          <div className="mt-4">
            {Array.from(files).filter((f) => !f.type.startsWith('image/')).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Documents:</p>
                {Array.from(files)
                  .filter((f) => !f.type.startsWith('image/'))
                  .map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-sm"
                    >
                      <span className="text-gray-600">📄</span>
                      <span className="flex-1 truncate font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={handleSubmitComplaint}
        disabled={isSubmitting}
        className="w-full custom-submit-btn py-3 px-6"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
      </Button>
    </div>
  )
}

export default FormField
