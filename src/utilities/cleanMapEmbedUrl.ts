// The map field is often filled by pasting Google's whole embed snippet, or the
// URL followed by the rest of it (`...!5m2!1sen" width="600" ...`). Keep only
// the URL so the iframe src is valid.
export const cleanMapEmbedUrl = (value?: string | null): string => {
  if (!value) return ''
  const v = value.trim()
  const fromSrc = v.match(/src=["']([^"']+)["']/i)?.[1]
  return (fromSrc || v).split(/["'\s]/)[0].replace(/&amp;/g, '&')
}
