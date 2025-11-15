import React from 'react'

interface SubmissionField {
  field: string
  value: string
  country?: string
  phone?: string
}

interface SubmissionDataViewProps {
  value?: SubmissionField[]
}

export const SubmissionDataView: React.FC<SubmissionDataViewProps> = ({ value }) => {
  if (!value || !Array.isArray(value)) return <p>No data submitted.</p>

    const dataMap = Object.fromEntries(value.map((item: SubmissionField) => [item.field, item.value])) as Record<string, string>

    const labelMap: Record<string, string> = {
        fullname: 'Full Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
    }
    const phoneDisplay = dataMap.phone ? `${dataMap.country ? dataMap.country + ' ' : ''}${dataMap.phone}` : null

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '16px',
                background: '#fafafa',
            }}
        >
            {Object.entries(labelMap).map(([key, label]) => (
                <div
                    key={key}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                        padding: '6px 0',
                        borderBottom: '1px solid #eee',
                    }}
                >
                    {label}
                    <strong><span style={{ fontSize: '14px' }}>{dataMap[key] || '—'}</span></strong>
                </div>
            ))}

            {phoneDisplay && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: '1px solid #eee',
                    }}
                >
                    Phone
                    <strong><span style={{ fontSize: '14px' }}>{phoneDisplay}</span></strong>
                </div>
            )}
        </div>
    )
}
