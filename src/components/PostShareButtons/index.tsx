import React from 'react'
import { Facebook, Linkedin, Twitter } from 'lucide-react'
import { getServerSideURL } from '@/utilities/getURL'

export const PostShareButtons: React.FC<{ slug: string; title: string }> = ({ slug, title }) => {
  const url = `${getServerSideURL()}/posts/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Twitter,
    },
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: Facebook,
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
