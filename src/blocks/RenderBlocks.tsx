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
import { PartnersDirectoryBlock } from './PartnersDirectory/Component'
import { QuickEnquiryBlock } from './QuickEnquiry/Component'
import { ServicesHeroBlock } from './ServicesHero/Component'
import { ServicesStepsBlock } from './ServicesSteps/Component'
import { ServiceDetailBannerBlock } from './ServiceDetailBanner/Component'
import { ServiceOverviewBlock } from './ServiceOverview/Component'
import { ServiceSolutionsBlock } from './ServiceSolutions/Components'
import { ServiceCatalogBlock } from './ServiceCatalog/Component'
import { StatsBlock } from './Stats/Component'
import { SLATableBlock } from './SLATable/Component'
import { QualificationBlock } from './Qualification/Component'
import { ComparisonTableBlock } from './ComparisonTable/Component'
import { LeadCaptureFormBlock } from './LeadCaptureForm/Component'
import { RelatedServicesBlock } from './RelatedServices/Component'
import { ServiceCoverageBlock } from './ServiceCoverage/Component'
import { DowntimeEstimatorBlock } from './DowntimeEstimator/Component'
import { AssuranceStripBlock } from './AssuranceStrip/Component'
import { ScopeChecklistBlock } from './ScopeChecklist/Component'
import { SpecComparisonTableBlock } from './SpecComparisonTable/Component'
import { RoomPanelDemoBlock } from './RoomPanelDemo/Component'
import { CategorizedIntegrationsBlock } from './CategorizedIntegrations/Component'
import { DeviceBrandShowcaseBlock } from './DeviceBrandShowcase/Component'
import { BrandDeviceGridBlock } from './BrandDeviceGrid/Component'
import { DeviceEnquiryBlock } from './DeviceEnquiry/Component'
import { ImageContentBlock } from './ImageContent/Component'
import { RoomSizeCardsBlock } from './RoomSizeCards/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { AccreditationsBlock } from './Accreditations/Component'
import { IndustriesBlock } from './Industries/Component'
import { DeliveryProcessBlock } from './DeliveryProcess/Component'
import { AboutTeaserBlock } from './AboutTeaser/Component'
import { BlogScrollBlock } from './BlogScroll/Component'

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
  partnersDirectory: PartnersDirectoryBlock,
  quickEnquiry: QuickEnquiryBlock,
  currentOpenings: CurrentOpeningsBlock,
  serviceSolutions: ServiceSolutionsBlock,
  servicesHero: ServicesHeroBlock,
  servicesSteps: ServicesStepsBlock,
  serviceDetailBanner: ServiceDetailBannerBlock,
  serviceOverview: ServiceOverviewBlock,
  serviceCatalog: ServiceCatalogBlock,
  stats: StatsBlock,
  slaTable: SLATableBlock,
  qualification: QualificationBlock,
  comparisonTable: ComparisonTableBlock,
  leadCaptureForm: LeadCaptureFormBlock,
  relatedServices: RelatedServicesBlock,
  serviceCoverage: ServiceCoverageBlock,
  downtimeEstimator: DowntimeEstimatorBlock,
  assuranceStrip: AssuranceStripBlock,
  scopeChecklist: ScopeChecklistBlock,
  specComparisonTable: SpecComparisonTableBlock,
  roomPanelDemo: RoomPanelDemoBlock,
  categorizedIntegrations: CategorizedIntegrationsBlock,
  deviceBrandShowcase: DeviceBrandShowcaseBlock,
  brandDeviceGrid: BrandDeviceGridBlock,
  deviceEnquiry: DeviceEnquiryBlock,
  imageContent: ImageContentBlock,
  roomSizeCards: RoomSizeCardsBlock,
  testimonials: TestimonialsBlock,
  accreditations: AccreditationsBlock,
  industries: IndustriesBlock,
  deliveryProcess: DeliveryProcessBlock,
  aboutTeaser: AboutTeaserBlock,
  blogScroll: BlogScrollBlock,
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
