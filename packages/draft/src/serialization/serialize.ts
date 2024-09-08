import { Node, Text, Element } from 'slate';
import escapeHtml from 'escape-html';
import { DraftElement, DraftText, LinkElement } from '../types';

export function serializeNodesToHTML(nodes: Node[]): string {
  return nodes.map(node => serializeNodeToHTML(node)).join('');
}

export function serializeNodeToHTML(node: Node): string {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text)
        if ((node as DraftText).bold) {
            string = `<strong>${string}</strong>`
        }
        if ((node as DraftText).italic) {
            string = `<em>${string}</em>`
        }
        if ((node as DraftText).underline) {
            string = `<u>${string}</u>`
        }
        return string
    } else if (Element.isElement(node)) {
        const children = node.children.map(n => serializeNodeToHTML(n)).join('');

        switch ((node as DraftElement).type) {
            case 'quote':
                return `<blockquote><p>${children}</p></blockquote>`
            case 'paragraph':
                return `<p>${children}</p>`
            case 'tip':
                return ``
            case 'link':
                return `<a href="${escapeHtml((node as LinkElement).url)}">${children}</a>`
            default:
                return children
        }
    }
    return ''
}

export function serializeNodesToText(nodes: Node[]): string {
    return nodes.map(node => serializeNodeToText(node)).join('');
}

export function serializeNodeToText(node: Node): string {
    if (Text.isText(node)) {
        return node.text;
    }
    if (Element.isElement(node)) {
        return node.children.map(n => serializeNodeToText(n)).join('');
    }
    return '';
}