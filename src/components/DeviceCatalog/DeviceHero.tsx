'use client'

import React, { useMemo, useState } from 'react'
import type { Device, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/site/Reveal'
import { Button } from '@/components/ui/button'
import { useDeviceCart } from '@/providers/DeviceCart'
import { EnquiryModal } from './EnquiryModal'

function ImageGallery({ device }: { device: Device }) {
  const images = useMemo(() => {
    const galleryImages = (device.gallery || [])
      .map((g) => g.image)
      .filter((img): img is MediaType => typeof img === 'object' && img !== null)
    if (galleryImages.length > 0) return galleryImages
    if (device.image && typeof device.image === 'object') return [device.image]
    return []
  }, [device])

  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  return (
    // h-full + flex-col so the main photo fills whatever height the right
    // column naturally takes up (matching it), with the thumbnail strip
    // pinned below at a fixed size rather than growing the whole column
    // taller than the surrounding content.
    <div className="flex h-full min-h-[320px] flex-col">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-gray-50">
        {activeImage ? (
          <Media
            resource={activeImage}
            fill
            priority
            size="(max-width: 768px) 100vw, 400px"
            imgClassName="object-contain p-8"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-wider text-gray-400">
            {device.brand}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-none gap-2">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square w-16 flex-none overflow-hidden rounded-lg border bg-gray-50 transition-colors ${
                i === activeIndex ? 'border-primary_red' : 'border-border hover:border-primary_red/40'
              }`}
            >
              <Media resource={img} fill size="64px" imgClassName="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function DeviceHero({ device }: { device: Device }) {
  const [quantity, setQuantity] = useState(1)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const { items, addItem, isInCart, openCart } = useDeviceCart()
  const inCart = isInCart(device.id)

  // Model/SKU-style identifier derived from the title (e.g. "Yealink UVC86
  // Dual-Eye PTZ Camera" -> "UVC86 Dual-Eye PTZ Camera") since there's no
  // dedicated SKU field.
  const sku = device.title.replace(device.brand, '').trim()

  return (
    <section className="bg-white pt-8 pb-10 md:pt-10">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <ImageGallery device={device} />

          <div>
            <div className="flex justify-end">
              <button
                onClick={openCart}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary_red hover:text-primary_red"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Quote Cart
                {items.length > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary_red px-1 text-[10px] text-white">
                    {items.length}
                  </span>
                )}
              </button>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {device.title}
            </h1>

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
              <span className="font-semibold text-foreground">SKU</span>
              <span className="text-gray-500">{sku}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-primary_red">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary_red text-[10px] text-white">
                ✓
              </span>
              IN STOCK
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
              <span>🚚</span>
              <span className="font-semibold text-foreground">Delivery across UAE</span>
              <span aria-hidden="true">🇦🇪</span>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <span className="text-sm font-semibold text-foreground">QTY</span>
              <div className="mt-2 inline-flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-500 hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5">
              <Button
                variant={inCart ? 'outline' : 'default'}
                onClick={() => addItem({ id: device.id, title: device.title, brand: device.brand }, quantity)}
              >
                {inCart ? 'Added to Quote Cart' : 'Add to Cart'}
              </Button>
              <Button variant="outline" onClick={() => setShowEnquiry(true)}>
                Enquire
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      {showEnquiry && (
        <EnquiryModal deviceNames={[device.title]} onClose={() => setShowEnquiry(false)} />
      )}
    </section>
  )
}
