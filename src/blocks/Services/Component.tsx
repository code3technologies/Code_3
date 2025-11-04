import type { ServicesBlock as ServicesBlockProps } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ServicesBlockClient } from './ServicesBlockClient'

export const ServicesBlock: React.FC<
  ServicesBlockProps & { id?: string; maxServices?: number }
> = async (props) => {
  const { id, maxServices = 6 } = props
  const payload = await getPayload({ config: configPromise })

  const servicePages = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: maxServices * 2,
    where: {
      and: [
        {
          serviceCategory: {
            in: ['infrastructure', 'digital'],
          },
        },
        {
          or: [
            {
              parentService: {
                equals: null,
              },
            },
            {
              parentService: {
                exists: false,
              },
            },
          ],
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return (
    <div className="" id={`block-${id}`}>
      {/* Pass fetched data to the client boundary */}
      <ServicesBlockClient {...props} servicePages={servicePages.docs} />
    </div>
  )
}
