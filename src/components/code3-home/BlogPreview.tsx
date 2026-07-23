import React from 'react'
import Link from 'next/link'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface BlogPostData {
  category: string
  date: string
  title: string
  excerpt: string
  href?: string
  imageUrl?: string
}

export interface BlogPreviewProps {
  eyebrow?: string
  title?: string
  posts?: BlogPostData[]
}

const DEFAULT_POSTS: BlogPostData[] = [
  {
    category: 'CYBERSECURITY',
    date: 'JUN 2026',
    title: '5 signs your business needs a managed IT partner',
    excerpt: 'How proactive monitoring prevents the downtime that reactive IT teams miss.',
  },
  {
    category: 'CLOUD',
    date: 'MAY 2026',
    title: 'Migrating to Microsoft 365 without disrupting operations',
    excerpt: 'A practical checklist for enterprises planning a phased cloud migration.',
  },
  {
    category: 'NETWORKING',
    date: 'APR 2026',
    title: 'Why your network is your first line of defense',
    excerpt: 'Designing infrastructure that scales security alongside growth.',
  },
  {
    category: 'INDUSTRY',
    date: 'MAR 2026',
    title: 'What retail businesses need from AV & surveillance',
    excerpt: 'Balancing customer experience with security across multi-site operations.',
  },
]

export function BlogPreview({
  eyebrow = 'FROM THE BLOG',
  title = 'Insights on IT, security, and digital growth',
  posts = DEFAULT_POSTS,
}: BlogPreviewProps) {
  if (posts.length === 0) return null

  return (
    <section id="blog" className="relative overflow-hidden py-[120px] max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -left-[100px] -top-[160px] z-0 h-[440px] w-[440px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(223,51,65,0.13), transparent 68%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-code3-text">
            {title}
          </h2>
        </Reveal>
        <Reveal className="c3-blog-scroll flex snap-x gap-6 overflow-x-auto pb-3">
          {posts.map((post) => {
            const Card = (
              <article className="w-[330px] flex-none snap-start overflow-hidden rounded-[14px] border border-code3-line-light bg-white transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-22px_rgba(10,15,30,0.2)]">
                <div
                  className="relative h-[150px] bg-cover bg-center"
                  style={{
                    background: post.imageUrl
                      ? `url(${post.imageUrl}) center/cover`
                      : 'linear-gradient(135deg, #120A09, #251815)',
                  }}
                >
                  <span className="font-jetmono absolute bottom-3.5 left-[18px] text-[11px] tracking-[0.08em] text-code3-signal">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="font-jetmono mb-2.5 text-xs text-code3-slate-light">
                    {post.date}
                  </div>
                  <h4 className="font-grotesk mb-2.5 text-[16.5px] leading-snug text-code3-text">
                    {post.title}
                  </h4>
                  <p className="font-inter text-[13.5px] leading-snug text-code3-slate">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            )
            return post.href ? (
              <Link key={post.title} href={post.href}>
                {Card}
              </Link>
            ) : (
              <div key={post.title}>{Card}</div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
