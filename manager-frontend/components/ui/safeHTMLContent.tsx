import { ReactNode } from 'react'

interface SafeHTMLContentProps {
  content: ReactNode
}

export const SafeHTMLContent = ({ content }: SafeHTMLContentProps) => {
  // обрабатываем ссылки
  if (typeof content === 'string') {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/gi

    const parts: ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }

      const [, , href, linkText] = match
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {linkText}
        </a>
      )

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    if (parts.length === 0) {
      return <div className="mb-6 whitespace-pre-line">{content}</div>
    }

    return <div className="mb-6 whitespace-pre-line">{parts}</div>
  }

  // если content уже ReactNode просто рендерим его
  return <div className="mb-6 whitespace-pre-line">{content}</div>
}
