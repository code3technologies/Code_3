// Shared between the RichText heading converter and the table-of-contents
// extractor so both produce the exact same ids for the same document — the
// TOC's anchor links only work if the two independent tree-walks agree.

export function slugifyHeadingText(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'section'
  )
}

export function createHeadingIdGenerator() {
  const seen = new Map<string, number>()
  return (text: string): string => {
    const base = slugifyHeadingText(text)
    const count = seen.get(base) || 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}

// Accepts `unknown` rather than a strict shape since it's called with both
// our own loose walk-tree type and the library's SerializedHeadingNode,
// which are structurally incompatible despite representing the same data.
export function flattenLexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const { text, children } = node as { text?: unknown; children?: unknown }
  if (typeof text === 'string') return text
  if (Array.isArray(children)) return children.map(flattenLexicalText).join('')
  return ''
}
