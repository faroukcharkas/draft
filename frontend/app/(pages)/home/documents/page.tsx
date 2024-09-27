import { getUserDocuments } from "@/actions/me/documents";
import DocumentCard from "./parts/document-card";
import Header from "./parts/header";

export default async function DocumentsPage() {
  const documents = await getUserDocuments();
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#fbfbfb] to-[#f7f7f7]">
      <Header />
      <main className="flex-1 p-8">
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {documents.map((doc) => (
              <DocumentCard
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
