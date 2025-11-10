'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  isComplaintForm?: boolean
  uploadedFiles?: FileList | null
}

function hasName(field: FormFieldBlock): field is FormFieldBlock & { name: string } {
  return 'name' in field && typeof field.name === 'string'
}

function hasDefaultValue(field: FormFieldBlock): field is FormFieldBlock & { defaultValue: any } {
  return 'defaultValue' in field
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    isComplaintForm = false,
    uploadedFiles,
  } = props

  if (!formFromProps || !formFromProps.fields) {
    return (
      <div className="p-4 text-center text-red-600 border border-red-200 rounded bg-red-50">
        <p>Error: Form data is not available. Please check the form configuration.</p>
      </div>
    )
  }

  const defaultValues =
    formFromProps.fields?.reduce((acc, field: FormFieldBlock) => {
      if (hasName(field)) {
        acc[field.name] = hasDefaultValue(field) ? field.defaultValue : ''
      }
      return acc
    }, {} as Record<string, any>) || {}

  const formMethods = useForm({
    defaultValues,
    mode: 'onBlur',
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError: setFormError,
    clearErrors,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: Record<string, any>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)
        clearErrors()

        if (uploadedFiles && uploadedFiles.length > 0) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i]
          
          if (!allowedTypes.includes(file.type)) {
            setError({
              message: `File "${file.name}" has unsupported format. Please upload only JPG, PNG, GIF, WEBP, PDF, DOC, or DOCX files.`,
              status: '400',
            })
            return
          }
          
          if (file.size > 10 * 1024 * 1024) {
            setError({
              message: `File "${file.name}" exceeds 10MB limit.`,
              status: '400',
            })
            return
          }
        }
      }
      
        // Format form data
        const dataToSend = Object.entries(data)
          .filter(([, value]) => value !== undefined && value !== null && value !== '')
          .map(([name, value]) => ({
            field: name,
            value,
          }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          // Step 1: Upload files to complaint-attachments collection
          const attachmentIds: string[] = []

          if (uploadedFiles && uploadedFiles.length > 0) {
            for (let i = 0; i < uploadedFiles.length; i++) {
              const fileFormData = new FormData()
              fileFormData.append('file', uploadedFiles[i])

              const uploadRes = await fetch(`${getClientSideURL()}/api/complaint-attachments`, {
                method: 'POST',
                body: fileFormData,
              })

              if (uploadRes.ok) {
                const uploadedFile = await uploadRes.json()
                attachmentIds.push(uploadedFile.doc.id)
              } else {
                console.error('Failed to upload file:', uploadedFiles[i].name)
              }
            }
          }

          // Step 2: Submit complaint with file IDs
          const endpoint = isComplaintForm
            ? `${getClientSideURL()}/api/complaints`
            : `${getClientSideURL()}/api/enquiries`

          const payload = {
            form: formID,
            submissionData: dataToSend,
            attachments: attachmentIds, // ✅ Include uploaded file IDs
            ...(isComplaintForm && { status: 'pending' }),
          }

          const req = await fetch(endpoint, {
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || res.error || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: err instanceof Error ? err.message : 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, isComplaintForm, uploadedFiles, clearErrors],
  )

  return (
    <div className="lg:max-w-[48rem] bg-[#FCFCFC]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {`${error.status || '500'}: ${error.message || ''}`}
            </div>
          )}
          {!hasSubmitted && (
            <form id={formID} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {formFromProps.fields?.map((field, index) => {
                  const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                  if (Field) {
                    return (
                      <div className="mb-6 last:mb-0" key={index}>
                        <Field
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <Button form={formID} type="submit" className='w-full' variant="default">
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
