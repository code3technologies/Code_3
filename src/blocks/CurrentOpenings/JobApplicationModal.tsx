'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getClientSideURL } from '@/utilities/getURL'
import { Button } from '@/components/ui/button'

type FormValues = {
  name: string
  email: string
  phone: string
  location: string
  employmentStatus: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Please upload a PDF, DOC, or DOCX file.'
  if (file.size > MAX_FILE_SIZE) return 'File exceeds 10MB limit.'
  return null
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${getClientSideURL()}/api/job-application-attachments`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const json = await res.json()
  return json.doc.id
}

export function JobApplicationModal({ jobTitle, onClose }: { jobTitle: string; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', email: '', phone: '', location: '', employmentStatus: '' },
  })

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setError(null)
      setFileError(null)

      if (!resumeFile) {
        setFileError('Resume is required.')
        return
      }
      const resumeErr = validateFile(resumeFile)
      if (resumeErr) {
        setFileError(resumeErr)
        return
      }
      if (coverLetterFile) {
        const clErr = validateFile(coverLetterFile)
        if (clErr) {
          setFileError(clErr)
          return
        }
      }

      setIsLoading(true)
      try {
        const resumeId = await uploadFile(resumeFile)
        const coverLetterId = coverLetterFile ? await uploadFile(coverLetterFile) : undefined

        const req = await fetch(`${getClientSideURL()}/api/job-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle,
            name: data.name,
            email: data.email,
            phone: data.phone,
            location: data.location,
            employmentStatus: data.employmentStatus,
            resume: resumeId,
            ...(coverLetterId ? { coverLetter: coverLetterId } : {}),
          }),
        })

        if (!req.ok) {
          const res = await req.json().catch(() => null)
          setError(res?.errors?.[0]?.message || 'Something went wrong. Please try again.')
          setIsLoading(false)
          return
        }

        setIsLoading(false)
        setSubmitted(true)
      } catch {
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
      }
    },
    [resumeFile, coverLetterFile, jobTitle],
  )

  const fieldClassName =
    'w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary_red'
  const fileFieldClassName =
    'w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border file:border-border file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative z-50 my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <p className="text-base font-semibold text-foreground">Application submitted!</p>
            <p className="mt-1 text-sm text-gray-600">
              Thank you for applying for {jobTitle}. Our team will review your application and get
              back to you.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-foreground">Apply Now</h3>
            <p className="mb-4 mt-1 text-sm text-gray-600">
              Applying for: <span className="font-medium text-foreground">{jobTitle}</span>
            </p>

            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register('name', { required: true })}
                  className={fieldClassName}
                />
                {errors.name && <p className="mt-1 text-xs text-primary_red">Full name is required.</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className={fieldClassName}
                />
                {errors.email && <p className="mt-1 text-xs text-primary_red">A valid email is required.</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  {...register('phone', { required: true, pattern: /^[0-9+\s]+$/, minLength: 8 })}
                  className={fieldClassName}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-primary_red">A valid phone number is required.</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Current location (e.g. Dubai, UAE)"
                  {...register('location', { required: true })}
                  className={fieldClassName}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-primary_red">Current location is required.</p>
                )}
              </div>
              <div>
                <select
                  {...register('employmentStatus', { required: true })}
                  defaultValue=""
                  className={fieldClassName}
                >
                  <option value="" disabled>
                    Current employment status
                  </option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="freelancer">Freelancer / Self-Employed</option>
                  <option value="student">Student</option>
                </select>
                {errors.employmentStatus && (
                  <p className="mt-1 text-xs text-primary_red">Please select your employment status.</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Resume *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className={fileFieldClassName}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Cover Letter (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCoverLetterFile(e.target.files?.[0] || null)}
                  className={fileFieldClassName}
                />
              </div>

              {fileError && <p className="text-xs text-primary_red">{fileError}</p>}
              {error && <p className="text-xs text-primary_red">{error}</p>}

              <Button type="submit" variant="default" disabled={isLoading} className="w-full disabled:opacity-50">
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
