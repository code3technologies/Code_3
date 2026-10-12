import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { PhotoImpactHero } from '@/heros/PhotoImpact'
import { SoftImpactHero } from '@/heros/SoftImpact'
import { SplitImpactHero } from '@/heros/SplitImpact'
import { VividImpactHero } from '@/heros/VividImpact'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Locale } from '@/utilities/getLocale'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  photoImpact: PhotoImpactHero,
  softImpact: SoftImpactHero,
  vividImpact: VividImpactHero,
  splitImpact: SplitImpactHero,
}

export const RenderHero: React.FC<Page['hero'] & { locale?: Locale }> = async (props) => {
  const { type, locale = 'en' } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  // Only the homepage-style hero gets the floating social rail for now - the
  // other hero types weren't part of this request, and threading socialLinks
  // through all of them isn't needed unless asked for.
  if (type === 'highImpact') {
    const footer = (await getCachedGlobal('footer', 1, locale)()) as { socialLinks?: Record<string, string | null | undefined> }
    return <HighImpactHero {...props} socialLinks={footer?.socialLinks} />
  }

  return <HeroToRender {...props} />
}
