// Neutral types module - kept separate from Component.client.tsx so the
// dynamically-imported menu components (MobileMenu, InfraMegaMenu,
// ProductsMegaMenu) can import these without creating a dynamic-import ->
// static-import cycle back into the file that's importing them.

export interface NavigationPageData {
  id: string
  slug: string | null | undefined
  title: string
  serviceCategory: 'none' | 'infrastructure' | 'digital' | null | undefined
  parentService: string | null
  isSubService: boolean
}

export interface TechPartnerData {
  name: string
  logoUrl?: string | null
}

export interface ProductDeviceData {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  category?: string | null
}

export interface ProductBrandData {
  brand: string
  devices: ProductDeviceData[]
}

export interface NavigationItem {
  id?: string | null
  label: string
  link: string
  type?: 'link' | 'dropdown' | 'mega' | 'anchor' | 'internal' | 'external' | null
  openInNewTab?: boolean | null
  order?: number | null
  subItems?: SubNavigationItem[] | null
}

export interface SubNavigationItem {
  label: string
  link: string
  icon?: string | null
  description?: string | null
  openInNewTab?: boolean | null
}
