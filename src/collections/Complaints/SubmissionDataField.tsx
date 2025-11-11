import type React from 'react'
import type { JSONFieldServerComponent } from 'payload'

interface SubmissionDataItem {
  field: string
  value: string | number | boolean | object
}

const SubmissionDataField: JSONFieldServerComponent = ({ data, field }) => {
  const value = data?.[field.name] as SubmissionDataItem[] | undefined

  if (!value || !Array.isArray(value) || value.length === 0) {
    return (
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500 text-sm">No complaint data submitted</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-base font-semibold text-gray-900">
          User Submitted Complaint
        </label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {value.length} field{value.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {value.map((item: SubmissionDataItem, index: number) => (
          <div
            key={index}
            className={`p-4 ${index !== value.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
          >
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {item.field || 'Unknown Field'}
                  </dt>
                  <dd className="text-sm text-gray-900 break-words whitespace-pre-wrap">
                    {typeof item.value === 'object'
                      ? JSON.stringify(item.value, null, 2)
                      : String(item.value || '—')}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubmissionDataField
