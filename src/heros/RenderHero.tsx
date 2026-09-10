import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { PhotoImpactHero } from '@/heros/PhotoImpact'
import { SoftImpactHero } from '@/heros/SoftImpact'
import { SplitImpactHero } from '@/heros/SplitImpact'
import { VividImpactHero } from '@/heros/VividImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  photoImpact: PhotoImpactHero,
  softImpact: SoftImpactHero,
  vividImpact: VividImpactHero,
  splitImpact: SplitImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
