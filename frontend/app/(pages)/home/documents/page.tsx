import { getUserDocuments } from "@/actions/me/documents";
import Link from "next/link";
import { Tables } from "@/packages/schema";
import { Plus as PlusIcon } from "iconoir-react/regular";
import { Button } from "@/components/ui/button";

function Document({ document }: { document: Tables<"document"> }) {
  return (
    <Link
      href={`/document/${document.id}`}
      className="p-4 border gap-2 flex flex-col rounded-lg hover:bg-gray-100"
    >
      <div className="bg-gray-200 w-full h-[50px] rounded-lg"></div>
      <h2 className="text-lg font-semibold">{document.title}</h2>
    </Link>
  );
}

export default async function DocumentsPage() {
  const documents = await getUserDocuments();

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <header className="flex h-[60px] p-5 items-center border-b">
        <h1 className="text-2xl font-bold">Pentip</h1>
      </header>
      <main className="flex-1 p-8">
        <div className="flex flex-row justify-between mb-4">
          <h1 className="text-2xl font-bold">Documents</h1>
          <Button>
            <PlusIcon />
            New
          </Button>
        </div>
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {documents.map((doc) => (
              <Document
                key={doc.id}
                document={doc}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No documents found</p>
        )}
      </main>
    </div>
  );
}
