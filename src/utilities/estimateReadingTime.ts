import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { flattenLexicalText } from './headingId'

const WORDS_PER_MINUTE = 200

// Rough estimate from total word count across the whole document — good
// enough for a "X min read" badge, not meant to be precise.
export function estimateReadingTime(data?: DefaultTypedEditorState | null): number {
  const root = (data as { root?: { children?: unknown[] } } | null | undefined)?.root
  if (!root?.children) return 0

  const text = flattenLexicalText({ children: root.children })
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  if (wordCount === 0) return 0

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}
