import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export interface PartnerData {
  name: string
  logoUrl?: string
}

export interface AccreditationsProps {
  eyebrow?: string
  partners?: PartnerData[]
}

const DEFAULT_PARTNERS: PartnerData[] = [
  'Acronics',
  'QNAP',
  'Biamp',
  'JBL',
  'Clevertouch',
  'Avaya',
  'Sophos',
  'Poly',
  'Yamaha',
  'Fortinet',
  'Yealink',
  'QSC',
  'Bose',
  'Cisco',
  'Ubiquiti',
  'Shure',
  'Synology',
  'Logitech',
  'OneScreen',
  'Sennheiser',
  'Barco',
  'Microsoft',
  'ClearOne',
  'Crestron',
  'Yeastar',
  '3CX',
  'CrowdStrike',
  'SentinelOne',
  'Dell',
  'Suprema',
  'Proofpoint',
  'Lenovo',
  'People Link',
  'Aver',
  'Dahua',
  'HP',
  'Honeywell',
  'Hikvision',
  'Unifi',
  'ZKTeco',
  'Extron',
  'Matrix',
  'Maxhub',
].map((name) => ({ name }))

export function Accreditations({
  eyebrow = 'TRUSTED BY LEADING TECHNOLOGY PARTNERS',
  partners = DEFAULT_PARTNERS,
}: AccreditationsProps) {
  return (
    <section
      id="accreditations"
      className="relative overflow-hidden border-y border-code3-line-light bg-white/[0.88] py-[70px]"
    >
      <div className="pointer-events-none absolute -right-[8%] -bottom-[160px] z-0 h-[360px] w-[360px] rounded-full border border-code3-signal/[0.16]" />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <div className="mb-10 flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-code3-line-light bg-code3-line-light sm:grid-cols-4 lg:grid-cols-6">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex h-[92px] items-center justify-center bg-white p-4 text-center transition-colors duration-300 hover:bg-code3-paper"
            >
              {p.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logoUrl} alt={p.name} className="max-h-9 max-w-full object-contain" />
              ) : (
                <span className="font-grotesk text-[14px] font-bold uppercase leading-tight tracking-tight text-code3-ink opacity-70">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
