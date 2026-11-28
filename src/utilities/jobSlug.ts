// URL slug for a role, from its English title: "ICT and ELV Technician" ->
// "ict-and-elv-technician". Kept free of server imports so the client-side
// Current Openings block can build the same links.
export const jobSlug = (title?: string | null): string =>
  (title || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
