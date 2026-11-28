'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { JobApplicationModal } from '@/blocks/CurrentOpenings/JobApplicationModal'

export const ApplyButton: React.FC<{ jobTitle: string; className?: string }> = ({ jobTitle, className }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default" className={className}>
        Apply Now
      </Button>
      {open && <JobApplicationModal jobTitle={jobTitle} onClose={() => setOpen(false)} />}
    </>
  )
}
