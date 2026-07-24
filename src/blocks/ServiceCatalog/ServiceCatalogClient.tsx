'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'

export interface ServiceItemData {
  icon: string
  title: string
  description?: string
  href?: string
}

export interface ServiceCategoryData {
  label: string
  items: ServiceItemData[]
}

export interface ServiceCatalogClientProps {
  className?: string
  titleHighlight?: string | null
  title?: string | null
  categories: ServiceCategoryData[]
}

export const ServiceCatalogClient: React.FC<ServiceCatalogClientProps> = ({
  className,
  titleHighlight,
  title,
  categories,
}) => {
  const safeCategories = categories || []
  const [activeIndex, setActiveIndex] = useState(0)
  const active = safeCategories[activeIndex]
  const items = active?.items || []

  return (
    <section className={cn('bg-white py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mb-8">
          <span className="block h-[3px] w-9 bg-primary_red mb-3" />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span className="text-primary_red">{titleHighlight}</span>{' '}
            <span className="text-foreground">{title}</span>
          </h2>
        </Reveal>

        {safeCategories.length > 1 && (
          <Reveal delayMs={80} className="flex flex-wrap gap-2.5 mb-10">
            {safeCategories.map((cat, i) => {
              const isActive = i === activeIndex
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200',
                    isActive
                      ? 'bg-foreground text-white border-foreground'
                      : 'bg-white text-gray-600 border-border hover:border-gray-400',
                  )}
                >
                  {cat.label}
                </button>
              )
            })}
          </Reveal>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            No published sub-service pages found under &ldquo;{active?.label}&rdquo; yet.
          </p>
        ) : (
          <Reveal
            delayMs={140}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border"
          >
            {items.map((item, i) => {
              const cardInner = (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-11 w-11 flex-none rounded-full border-2 border-primary_red/40 bg-white flex items-center justify-center">
                      <ServiceIcon preset={item.icon} className="h-5 w-5 text-primary_red" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  )}
                </>
              )

              return item.href ? (
                <Link
                  key={`${item.title}-${i}`}
                  href={item.href}
                  className="border-r border-b border-border p-6 hover:bg-gray-50 transition-colors"
                >
                  {cardInner}
                </Link>
              ) : (
                <div key={`${item.title}-${i}`} className="border-r border-b border-border p-6">
                  {cardInner}
                </div>
              )
            })}
          </Reveal>
        )}
      </div>
    </section>
  )
}
