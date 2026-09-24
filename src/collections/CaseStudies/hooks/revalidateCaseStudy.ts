import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { CaseStudy } from '../../../payload-types'

const revalidateAll = (slug?: string | null) => {
  if (slug) {
    revalidatePath(`/case-studies/${slug}`)
    revalidateTag(`case_study_${slug}`)
  }
  revalidatePath('/case-studies')
  revalidateTag('pages-sitemap')
}

export const revalidateCaseStudy: CollectionAfterChangeHook<CaseStudy> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc._status === 'published') {
    payload.logger.info(`Revalidating case study: ${doc.slug}`)
    revalidateAll(doc.slug)
  }

  // Was published, now isn't (unpublished / slug changed): clear the old path.
  if (previousDoc?._status === 'published' && (doc._status !== 'published' || previousDoc.slug !== doc.slug)) {
    revalidateAll(previousDoc.slug)
  }

  return doc
}

export const revalidateCaseStudyDelete: CollectionAfterDeleteHook<CaseStudy> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateAll(doc?.slug)
  return doc
}
