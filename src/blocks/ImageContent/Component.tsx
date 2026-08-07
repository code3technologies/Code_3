import React from 'react'
import type { ImageContentBlock as ImageContentBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import { Reveal } from '@/components/site/Reveal'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & ImageContentBlockProps

export const ImageContentBlock: React.FC<Props> = ({
  className,
  image,
  imagePosition = 'left',
  heading,
  richText,
}) => {
  const imageRight = imagePosition === 'right'

  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal
            className={cn(
              'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border',
              imageRight && 'md:order-2',
            )}
          >
            {image && typeof image === 'object' && (
              <Media resource={image} fill size="(max-width: 768px) 100vw, 50vw" imgClassName="object-cover" />
            )}
          </Reveal>

          <Reveal delayMs={100} className={cn(heading && 'md:-mt-20', imageRight && 'md:order-1')}>
            {heading && (
              <h1 className="mb-4 text-2xl font-semibold tracking-tight text-primary_red md:text-3xl lg:text-4xl">
                {heading}
              </h1>
            )}
            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
                className="text-sm text-gray-600 leading-relaxed md:text-base [&_p]:mb-4 [&_p:last-child]:mb-0"
              />
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
