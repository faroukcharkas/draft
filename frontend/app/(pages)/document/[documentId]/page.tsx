import Document from "@/app/components/document/document";
import { getDocument } from "./actions";

export default async function DocumentPage({
  params,
}: {
  params: { documentId: string };
}) {
  const document = await getDocument(params.documentId);

  return (
    <div className="flex h-screen w-screen">
      <main className="flex flex-1 justify-center">
        {document ? (
          <Document initialDocument={document} />
        ) : (
          <div>Document not found</div>
        )}
      </main>
    </div>
  );
}
