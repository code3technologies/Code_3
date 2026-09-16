import React from 'react'
import { Instagram, Linkedin } from 'lucide-react'
import { getServerSideURL } from '@/utilities/getURL'

// Instagram has no web share-intent for an arbitrary URL (it's app-only), so
// unlike the other platforms that icon links to CODE3's own profile rather
// than sharing this specific post.
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/code3.technologies'

export const PostShareButtons: React.FC<{ slug: string }> = ({ slug }) => {
  const url = `${getServerSideURL()}/posts/${slug}`
  const encodedUrl = encodeURIComponent(url)

  const links = [
    {
      label: 'CODE3 on Instagram',
      href: INSTAGRAM_PROFILE_URL,
      Icon: Instagram,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
  ]

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm text-gray-500">Share</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-gray-500 transition-colors hover:border-primary_red hover:bg-primary_red hover:text-white"
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
    </div>
  )
}
