import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Managed IT, cybersecurity, cloud, networking and AV solutions for businesses in Dubai and across the UAE.',
  images: [
    {
      url: `${getServerSideURL()}/code3-social-share.webp`,
    },
  ],
  siteName: 'CODE3 Technologies',
  title: 'CODE3 Technologies',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
