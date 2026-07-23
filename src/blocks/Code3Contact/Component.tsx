import React from 'react'
import type { Code3ContactBlock as Code3ContactBlockProps } from '@/payload-types'
import { Contact } from '@/components/code3-home/Contact'

export const Code3ContactBlock: React.FC<Code3ContactBlockProps> = ({
  eyebrow,
  title,
  description,
  phone,
  email,
  location,
  hours,
}) => {
  return (
    <Contact
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      phone={phone}
      email={email}
      location={location}
      hours={hours}
    />
  )
}
