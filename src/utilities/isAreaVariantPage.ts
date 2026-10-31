// Area/city variant pages (e.g. "...-abu-dhabi-uae", "...-sharjah-uae",
// "it-support-abu-dhabi") exist for SEO landing but shouldn't clutter the
// mega-menu or footer service navigation alongside the real service categories.
const AREA_VARIANT_SLUG = /-(abu-dhabi|sharjah)(-uae)?$/

export const isAreaVariantSlug = (slug: string | null | undefined): boolean =>
  !!slug && AREA_VARIANT_SLUG.test(slug)
