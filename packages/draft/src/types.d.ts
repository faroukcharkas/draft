import { BaseElement, Element, Text } from 'slate'

// Extend the Element type to include a 'type' property
export type DraftBaseElement = BaseElement & {
  type: string
}

// Extend the Text type to include optional formatting properties
export type DraftText = Text & {
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export type ParagraphElement = DraftBaseElement & { type: 'paragraph' }
export type QuoteElement = DraftBaseElement & { type: 'quote' }
export type TipElement = DraftBaseElement & { type: 'tip'}
export type LinkElement = DraftBaseElement & { type: 'link', url: string }

// Update this line to include LinkElement
export type DraftElement = ParagraphElement | QuoteElement | TipElement | LinkElement

// Update DraftNode to explicitly include LinkElement
export type DraftNode = DraftText | DraftElement