import type { BrandDeviceGridBlock as BrandDeviceGridBlockProps } from 'src/payload-types'
import React from 'react'
import { DeviceCartProvider } from '@/providers/DeviceCart'
import { DeviceGroupedGrid } from '@/components/DeviceCatalog/DeviceGroupedGrid'
import { CartFloatingButton } from '@/components/DeviceCatalog/CartFloatingButton'
import { CartDrawer } from '@/components/DeviceCatalog/CartDrawer'
import { SetLightHeader } from '@/components/DeviceCatalog/SetLightHeader'
import { getCachedBrandDevices } from '@/components/DeviceCatalog/getBrandDevices'

type Props = { id?: string } & BrandDeviceGridBlockProps

export const BrandDeviceGridBlock: React.FC<Props> = async ({ id, brand }) => {
  if (!brand) return null

  const devices = await getCachedBrandDevices(brand)

  return (
    <div id={id ? `block-${id}` : undefined}>
      <DeviceCartProvider>
        <SetLightHeader />
        <DeviceGroupedGrid devices={devices} />
        <CartFloatingButton />
        <CartDrawer />
      </DeviceCartProvider>
    </div>
  )
}
