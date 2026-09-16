import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'
import { createHeadingIdGenerator, flattenLexicalText } from '@/utilities/headingId'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  if (relationTo === 'posts') return `/posts/${slug}`
  // Service pages (serviceCategory set) live under /service/, not at the root slug.
  if ('serviceCategory' in value && value.serviceCategory) return `/service/${slug}`
  return slug === 'home' ? '/' : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  // Fresh per RichText render so ids stay in sync with extractHeadings, which
  // walks the same document from scratch for the table-of-contents card.
  const nextHeadingId = createHeadingIdGenerator()

  return {
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag as keyof React.JSX.IntrinsicElements
      const children = nodesToJSX({ nodes: node.children })
      if (node.tag === 'h2' || node.tag === 'h3') {
        const id = nextHeadingId(flattenLexicalText(node).trim())
        return (
          <Tag id={id} className="scroll-mt-28">
            {children}
          </Tag>
        )
      }
      return <Tag>{children}</Tag>
    },
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  }
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext text-black',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto': enableProse,
          prose: enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
