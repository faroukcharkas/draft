import { Descendant, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type FormattedText = {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
}

export type TipElement = {
    type: 'tip'
    tip: string
    children: Descendant[]
}

export type ParagraphElement = {
    type: 'paragraph'
    children: Descendant[]
}

export type QuoteElement = {
    type: 'quote'
    children: Descendant[]
}

export type LinkElement = {
    type: 'link'
    url: string
    children: Descendant[]
}

export type DocumentElement = ParagraphElement | QuoteElement | TipElement | LinkElement

export type DocumentText = FormattedText

declare module 'slate' {
    interface CustomTypes {
        Element: DocumentElement
        // Text: DocumentText
    }
}