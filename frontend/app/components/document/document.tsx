import { DocumentTitle } from "./parts/title";
import { DocumentBody } from "./parts/body";
import { Tables } from "@/packages/schema";

export default function Document({
  initialDocument,
}: {
  initialDocument: Tables<"document">;
}) {
  return (
    <div className="flex max-w-[850px] flex-1 pt-20">
      <div className="flex flex-1 flex-col gap-4 overflow-scroll px-20">
        <DocumentTitle
          initialTitle={initialDocument.title}
          documentId={initialDocument.id}
        />
        <DocumentBody
          initialBody={initialDocument.body}
          documentId={initialDocument.id}
        />
      </div>
    </div>
  );
}
