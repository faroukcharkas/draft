import { jsx } from 'slate-hyperscript'
import { DraftNode } from '../types'

export function deserializeHTMLToNodes(el: HTMLElement, markAttributes = {}): DraftNode[] {
  if (el.nodeType === window.Node.TEXT_NODE) {
    return [{ text: el.textContent || '', ...markAttributes }]
  } else if (el.nodeType !== window.Node.ELEMENT_NODE) {
    return []
  }

  const nodeAttributes: Record<string, any> = { ...markAttributes }

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes.bold = true
  }

  const children = Array.from(el.childNodes)
    .flatMap(node => deserializeHTMLToNodes(node as HTMLElement, nodeAttributes))

  if (children.length === 0) {
    children.push({ text: '', ...nodeAttributes })
  }

  switch (el.nodeName) {
    case 'BODY':
      return children
    case 'BR':
      return [{ text: '\n' }]
    case 'BLOCKQUOTE':
      return [{ type: 'quote', children }]
    case 'P':
      return [{ type: 'paragraph', children }]
    case 'A':
      return [{ type: 'link', url: el.getAttribute('href') ?? '', children }]
    default:
      return children
  }
}