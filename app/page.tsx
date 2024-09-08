import DocumentDraft from "./components/document-draft";

export default function Home() {
  return (
    <div className="bg-white flex h-screen w-screen">
      <main className="flex flex-1 justify-center">
        <DocumentDraft />
      </main>
    </div>
  );
}
