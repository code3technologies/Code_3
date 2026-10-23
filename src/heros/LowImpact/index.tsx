import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = (props) => {
  const { children, richText } = props
  // HeroText/subText are the plain-text fields authors reach for by default
  // (every other hero type renders them as the page's <h1>) - without this,
  // a page using this hero type with those fields set renders no heading at
  // all, since only `children`/`richText` were ever read here.
  const heroText = 'HeroText' in props ? props.HeroText : undefined
  const subText = 'subText' in props ? props.subText : undefined

  return (
    <div className="container">
      <div className="max-w-[48rem]">
        {heroText && <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{heroText}</h1>}
        {subText && <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">{subText}</p>}
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
