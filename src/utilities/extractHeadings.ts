import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { createHeadingIdGenerator, flattenLexicalText } from './headingId'

export type HeadingItem = { id: string; text: string; level: 2 | 3 }

type LexicalNodeLike = {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNodeLike[]
}

// Walks the Lexical document tree for a post's rich text and pulls out every
// H2/H3 in document order, for the table-of-contents card.
export function extractHeadings(data?: DefaultTypedEditorState | null): HeadingItem[] {
  const root = (data as { root?: { children?: LexicalNodeLike[] } } | null | undefined)?.root
  if (!root?.children) return []

  const nextId = createHeadingIdGenerator()
  const headings: HeadingItem[] = []

  const walk = (nodes: LexicalNodeLike[]) => {
    for (const node of nodes) {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = flattenLexicalText(node).trim()
        if (text) {
          headings.push({ id: nextId(text), text, level: node.tag === 'h2' ? 2 : 3 })
        }
      }
      if (Array.isArray(node.children)) walk(node.children)
    }
  }

  walk(root.children)
  return headings
}
