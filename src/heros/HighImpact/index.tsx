import React from 'react'

import type { Page } from '@/payload-types'

import { getCachedHomeServices } from './getHomeServices'
import { HighImpactHeroClient } from './Client'

// This hero type is only ever used by the homepage (confirmed against
// production data - it's the one page with hero.type "highImpact"), so it's
// safe to give it homepage-specific behavior like fetching the services list
// below, rather than staying a generic reusable hero variant.
export const HighImpactHero: React.FC<Page['hero']> = async ({ HeroText, subText }) => {
  const services = await getCachedHomeServices()()

  return <HighImpactHeroClient HeroText={HeroText} subText={subText} services={services} />
}
