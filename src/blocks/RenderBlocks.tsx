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
import { ServicesHeroBlock } from './ServicesHero/Component'
import { ServicesStepsBlock } from './ServicesSteps/Component'
import { ServiceDetailBannerBlock } from './ServiceDetailBanner/Component'
import { ServiceOverviewBlock } from './ServiceOverview/Component'
import { Code3HeroBlock } from './Code3Hero/Component'
import { Code3ServicesBlock } from './Code3Services/Component'
import { Code3WhyBlock } from './Code3Why/Component'
import { Code3StatsBlock } from './Code3Stats/Component'
import { Code3TestimonialsBlock } from './Code3Testimonials/Component'
import { Code3ClientsBlock } from './Code3Clients/Component'
import { Code3AccreditationsBlock } from './Code3Accreditations/Component'
import { Code3IndustriesBlock } from './Code3Industries/Component'
import { Code3ProcessBlock } from './Code3Process/Component'
import { Code3AboutTeaserBlock } from './Code3AboutTeaser/Component'
import { Code3BlogPreviewBlock } from './Code3BlogPreview/Component'
import { Code3FAQBlock } from './Code3FAQ/Component'
import { Code3ContactBlock } from './Code3Contact/Component'
import { Code3CTABannerBlock } from './Code3CTABanner/Component'
import { ServiceSolutionsBlock } from './ServiceSolutions/Components'

interface BlockProps {
  disableInnerContainer?: boolean
  currentPage?: Page | null
  [key: string]: unknown
}

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
  code3Hero: Code3HeroBlock,
  code3Services: Code3ServicesBlock,
  code3Why: Code3WhyBlock,
  code3Stats: Code3StatsBlock,
  code3Testimonials: Code3TestimonialsBlock,
  code3Clients: Code3ClientsBlock,
  code3Accreditations: Code3AccreditationsBlock,
  code3Industries: Code3IndustriesBlock,
  code3Process: Code3ProcessBlock,
  code3AboutTeaser: Code3AboutTeaserBlock,
  code3BlogPreview: Code3BlogPreviewBlock,
  code3Faq: Code3FAQBlock,
  code3Contact: Code3ContactBlock,
  code3CtaBanner: Code3CTABannerBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  currentPage?: Page | null
}> = (props) => {
  const { blocks, currentPage } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType] as React.ComponentType<BlockProps>

            if (Block) {
              return (
                <div className="" key={index}>
                  <Block {...block} blockId={(block as any).blockId} disableInnerContainer={true} currentPage={currentPage} />
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
