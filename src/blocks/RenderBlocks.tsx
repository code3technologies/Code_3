import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FAQBlock } from './FAQ/Component'
import { ServicesBlock } from './Services/Component'
import { MissionAndValuesBlock } from './MissionAndValues/Component'
import { WhyWorkWithUsBlock } from './WhyWorkWithUs/Component'
import { WhyChooseUsAboutBlock } from './WhyChooseUsAbout/Component'
import { ContactUsBlock } from './ContactUs/Component'
import { AboutUsBannerBlock } from './AboutUsBanner/Component'
import { WhyChooseUsBlock } from './WhyChooseUs/Component'
import { CurrentOpeningsBlock } from './CurrentOpenings/Component'
import { CareersBlock } from './CareersBanner/Component'
import { TrustedBrandsBlock } from './TrustedBrands/Component'
import { ServiceSolutionsBlock } from './ServiceSolutions/Components'
import { ServicesHeroBlock } from './ServicesHero/Component'
import { ServicesStepsBlock } from './ServicesSteps/Component'
import { ServiceDetailBannerBlock } from './ServiceDetailBanner/Component'
import { ServiceOverviewBlock } from './ServiceOverview/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  faq: FAQBlock,
  services: ServicesBlock,
  missionAndValues: MissionAndValuesBlock,
  whyWorkWithUs: WhyWorkWithUsBlock,
  whyChooseUsAbout: WhyChooseUsAboutBlock,
  whyChooseUs: WhyChooseUsBlock,
  contactUs: ContactUsBlock,
  careers: CareersBlock,
  aboutUsBanner: AboutUsBannerBlock,
  trustedBrands: TrustedBrandsBlock,
  currentOpenings: CurrentOpeningsBlock,
  serviceSolutions: ServiceSolutionsBlock,
  servicesHero: ServicesHeroBlock,
  servicesSteps: ServicesStepsBlock,
  serviceDetailBanner: ServiceDetailBannerBlock,
  serviceOverview: ServiceOverviewBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
