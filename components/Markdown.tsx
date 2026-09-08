import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * A small Markdown renderer for blog post bodies.
 *
 * Deliberately not a dependency and deliberately not `dangerouslySetInnerHTML`:
 * post bodies come from the database, so rendering them as HTML would make the
 * admin editor an XSS vector into every reader's browser. This builds React
 * nodes instead, so nothing in a post can inject markup.
 *
 * Supported, which is what an article actually needs:
 *   # ## ###     headings
 *   - / 1.       unordered and ordered lists
 *   >            blockquote
 *   ```          fenced code block
 *   ---          horizontal rule
 *   **bold**  *italic*  `code`  [text](url)
 *
 * Anything else renders as literal text rather than disappearing, so a writer
 * can see that a syntax is unsupported instead of losing their words.
 */

/** Splits a line into bold / italic / code / link spans. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g
  const parts = text.split(pattern).filter((p) => p !== '')

  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-bold text-audi-anthracite">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="technical text-[0.9em] bg-audi-mist border border-audi-fog rounded px-1.5 py-0.5"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) {
      const [, label, href] = link
      const internal = href.startsWith('/')
      // Internal links go through <Link> so they prefetch and keep the
      // crawler on a normal <a href> — the whole point of the related-parts
      // linking in a post.
      if (internal) {
        return (
          <Link key={key} href={href} className="text-audi-red font-medium hover:underline">
            {label}
          </Link>
        )
      }
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-audi-red font-medium hover:underline"
        >
          {label}
        </a>
      )
    }

    return <span key={key}>{part}</span>
  })
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []

  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let quote: string[] = []
  let code: { lines: string[] } | null = null

  function flushParagraph() {
    if (paragraph.length === 0) return
    const key = `p-${blocks.length}`
    blocks.push(
      <p key={key} className="text-[15px] leading-[1.75] text-audi-slate">
        {renderInline(paragraph.join(' '), key)}
      </p>,
    )
    paragraph = []
  }

  function flushList() {
    if (!list) return
    const key = `l-${blocks.length}`
    const Tag = list.ordered ? 'ol' : 'ul'
    blocks.push(
      <Tag
        key={key}
        className={`space-y-2 pl-5 text-[15px] leading-[1.75] text-audi-slate ${
          list.ordered ? 'list-decimal' : 'list-disc'
        }`}
      >
        {list.items.map((item, i) => (
          <li key={`${key}-${i}`} className="pl-1">
            {renderInline(item, `${key}-${i}`)}
          </li>
        ))}
      </Tag>,
    )
    list = null
  }

  function flushQuote() {
    if (quote.length === 0) return
    const key = `q-${blocks.length}`
    blocks.push(
      <blockquote
        key={key}
        className="border-l-2 border-audi-red pl-5 text-[15px] leading-[1.75] text-audi-steel italic"
      >
        {renderInline(quote.join(' '), key)}
      </blockquote>,
    )
    quote = []
  }

  function flushAll() {
    flushParagraph()
    flushList()
    flushQuote()
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    // Fenced code: consume verbatim until the closing fence.
    if (line.trim().startsWith('```')) {
      if (code) {
        blocks.push(
          <pre
            key={`c-${blocks.length}`}
            className="bg-audi-anthracite text-audi-silver rounded-lg p-4 overflow-x-auto text-[13px] technical leading-relaxed"
          >
            <code>{code.lines.join('\n')}</code>
          </pre>,
        )
        code = null
      } else {
        flushAll()
        code = { lines: [] }
      }
      continue
    }
    if (code) {
      code.lines.push(raw)
      continue
    }

    if (line.trim() === '') {
      flushAll()
      continue
    }

    if (/^---+$/.test(line.trim())) {
      flushAll()
      blocks.push(<hr key={`hr-${blocks.length}`} className="border-audi-fog" />)
      continue
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      flushAll()
      const [, hashes, text] = heading
      const key = `h-${blocks.length}`
      // h1 is the post title on the page, so a leading # in the body becomes
      // an h2 — one h1 per document is the rule crawlers care about.
      if (hashes.length === 1) {
        blocks.push(
          <h2 key={key} className="text-2xl font-bold text-audi-anthracite pt-3">
            {renderInline(text, key)}
          </h2>,
        )
      } else if (hashes.length === 2) {
        blocks.push(
          <h3 key={key} className="text-xl font-bold text-audi-anthracite pt-2">
            {renderInline(text, key)}
          </h3>,
        )
      } else {
        blocks.push(
          <h4 key={key} className="text-base font-bold text-audi-anthracite pt-1">
            {renderInline(text, key)}
          </h4>,
        )
      }
      continue
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line.trim())
    if (bullet) {
      flushParagraph()
      flushQuote()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(bullet[1])
      continue
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(line.trim())
    if (numbered) {
      flushParagraph()
      flushQuote()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(numbered[1])
      continue
    }

    const blockquote = /^>\s?(.*)$/.exec(line.trim())
    if (blockquote) {
      flushParagraph()
      flushList()
      quote.push(blockquote[1])
      continue
    }

    flushList()
    flushQuote()
    paragraph.push(line.trim())
  }

  // An unterminated fence still renders its content rather than swallowing it.
  if (code) {
    blocks.push(
      <pre
        key={`c-${blocks.length}`}
        className="bg-audi-anthracite text-audi-silver rounded-lg p-4 overflow-x-auto text-[13px] technical leading-relaxed"
      >
        <code>{code.lines.join('\n')}</code>
      </pre>,
    )
  }
  flushAll()

  return <div className="space-y-5">{blocks}</div>
}
