import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface ClientData {
  name: string
  logoUrl?: string
}

export interface ClientsProps {
  eyebrow?: string
  title?: string
  description?: string
  clients?: ClientData[]
}

const DEFAULT_CLIENTS: ClientData[] = [
  { name: 'Orion Retail Group' },
  { name: 'Vantage Properties' },
  { name: 'Meridian Expo Center' },
  { name: 'Falcon Marine Works' },
  { name: 'Solara Foods' },
  { name: 'Halcyon Holdings' },
  { name: 'Atlas Logistics' },
  { name: 'Northgate Capital' },
]

export function Clients({
  eyebrow = 'OUR HAPPY CLIENTS',
  title = 'Our Happy Clients',
  description = 'We keep our mission as making our clients very happy, delivering the latest technology with qualified, certified engineers.',
  clients = DEFAULT_CLIENTS,
}: ClientsProps) {
  return (
    <section className="relative overflow-hidden py-[120px] max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -left-[120px] -top-[160px] z-0 h-[460px] w-[460px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(223,51,65,0.14), transparent 68%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-14 max-w-[640px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk mb-3.5 text-[clamp(24px,2.6vw,32px)] font-semibold text-code3-text">
            {title}
          </h2>
          {description && (
            <p className="font-inter text-[15px] leading-relaxed text-code3-slate">
              {description}
            </p>
          )}
        </Reveal>
        <Reveal
          delayMs={100}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-code3-line-light bg-code3-line-light sm:grid-cols-4"
        >
          {clients.map((c) => (
            <div
              key={c.name}
              className="flex h-28 items-center justify-center bg-white p-4 text-center transition-colors duration-300 hover:bg-code3-paper"
            >
              {c.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.logoUrl} alt={c.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                <span className="font-grotesk text-[15px] font-bold uppercase tracking-tight text-code3-ink opacity-70">
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
