import React from 'react'
import './css/SourceLink.css'

export interface SourceLinkProps {
  url: string
}

export const SourceLink = ({ url }: SourceLinkProps) => {
  const domainMatch = /^.*?([a-z]+\.[a-z]+)\//
  const match = url.match(domainMatch)
  const domain = match && match.length === 2 ? match[1] : 'Unknown'
  return (
    <a
      className="source-link"
      rel="noreferrer"
      target="_blank"
      href={url}
    >
      &mdash; {domain}
    </a>
  )
}
