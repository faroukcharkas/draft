import { serializeNodesToHTML, serializeNodesToText } from './serialization/serialize';
import { deserializeHTMLToNodes } from './serialization/deserialize';

export const DraftSerialization = {
    serializeNodesToHTML: serializeNodesToHTML,
    deserializeHTMLToNodes: deserializeHTMLToNodes,
    serializeNodesToText: serializeNodesToText,
};
