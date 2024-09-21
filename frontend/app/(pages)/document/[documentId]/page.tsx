import Document from "@/components/document/document";
import { getDocument } from "./actions";
import { ArrowLeft as ArrowLeftIcon } from "iconoir-react/regular";
import Link from "next/link";

export default async function DocumentPage({
  params,
}: {
  params: { documentId: string };
}) {
  const document = await getDocument(params.documentId);

  return (
    <div className="flex h-screen w-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <header className="flex h-[60px] p-5 items-center justify-center">
        <Link href="/home/documents">
          <ArrowLeftIcon className="mr-2" />
        </Link>
      </header>
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
